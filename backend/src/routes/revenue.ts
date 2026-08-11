import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { protect, checkPermission } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/revenue/config
// @desc    Get revenue configuration
// @access  Private (Admin only)
router.get('/config', protect, checkPermission('MANAGE_REVENUE'), async (req, res) => {
  try {
    let revenueConfig = await prisma.revenueConfig.findFirst({
      include: {
        tiers: {
          orderBy: { minQty: 'asc' }
        }
      }
    });

    if (!revenueConfig) {
      // Create default revenue config if not exists
      revenueConfig = await prisma.revenueConfig.create({
        data: {
          modelType: 'FIXED',
          fixedPrice: 10.00,
          globalFreeLimit: 5,
          tiers: {
            create: [
              { minQty: 1, maxQty: 10, pricePerTicket: 15.00 },
              { minQty: 11, maxQty: 50, pricePerTicket: 12.00 },
              { minQty: 51, maxQty: 100, pricePerTicket: 10.00 },
              { minQty: 101, maxQty: null, pricePerTicket: 8.00 }
            ]
          }
        },
        include: {
          tiers: {
            orderBy: { minQty: 'asc' }
          }
        }
      });
    }

    res.json({
      success: true,
      data: revenueConfig
    });
  } catch (error) {
    console.error('Get revenue config error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/revenue/config
// @desc    Update revenue configuration
// @access  Private (Admin only)
router.put('/config', protect, checkPermission('MANAGE_REVENUE'), [
  body('modelType').isIn(['FIXED', 'TIERED']),
  body('fixedPrice').optional().isFloat({ min: 0 }),
  body('globalFreeLimit').isInt({ min: 0 }),
  body('tiers').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { modelType, fixedPrice, globalFreeLimit, tiers } = req.body;

    let revenueConfig = await prisma.revenueConfig.findFirst();

    if (revenueConfig) {
      // Update existing config
      await prisma.$transaction(async (tx) => {
        // Update main config
        await tx.revenueConfig.update({
          where: { id: revenueConfig!.id },
          data: {
            modelType,
            fixedPrice: fixedPrice || revenueConfig!.fixedPrice,
            globalFreeLimit
          }
        });

        // Handle tiers if model is TIERED
        if (modelType === 'TIERED' && tiers) {
          // Delete existing tiers
          await tx.revenueTier.deleteMany({
            where: { revenueConfigId: revenueConfig!.id }
          });

          // Create new tiers
          for (const tier of tiers) {
            await tx.revenueTier.create({
              data: {
                revenueConfigId: revenueConfig!.id,
                minQty: tier.minQty,
                maxQty: tier.maxQty,
                pricePerTicket: tier.pricePerTicket
              }
            });
          }
        }
      });

      // Fetch updated config
      revenueConfig = await prisma.revenueConfig.findFirst({
        include: {
          tiers: {
            orderBy: { minQty: 'asc' }
          }
        }
      });
    } else {
      // Create new config
      revenueConfig = await prisma.revenueConfig.create({
        data: {
          modelType,
          fixedPrice: fixedPrice || 10.00,
          globalFreeLimit,
          tiers: modelType === 'TIERED' && tiers ? {
            create: tiers.map((tier: any) => ({
              minQty: tier.minQty,
              maxQty: tier.maxQty,
              pricePerTicket: tier.pricePerTicket
            }))
          } : undefined
        },
        include: {
          tiers: {
            orderBy: { minQty: 'asc' }
          }
        }
      });
    }

    res.json({
      success: true,
      data: revenueConfig
    });
  } catch (error) {
    console.error('Update revenue config error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/revenue/calculate-price
// @desc    Calculate price based on quantity and current config
// @access  Private
router.get('/calculate-price', protect, async (req, res) => {
  try {
    const { quantity } = req.query;

    if (!quantity || isNaN(parseInt(quantity as string))) {
      return res.status(400).json({
        success: false,
        error: 'Valid quantity is required'
      });
    }

    const qty = parseInt(quantity as string);

    const revenueConfig = await prisma.revenueConfig.findFirst({
      include: {
        tiers: {
          orderBy: { minQty: 'asc' }
        }
      }
    });

    if (!revenueConfig) {
      return res.status(400).json({
        success: false,
        error: 'Revenue configuration not found'
      });
    }

    let pricePerTicket = 0;

    if (revenueConfig.modelType === 'FIXED') {
      pricePerTicket = revenueConfig.fixedPrice;
    } else {
      // Find appropriate tier
      const tier = revenueConfig.tiers.find(t =>
        qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty)
      );

      if (tier) {
        pricePerTicket = tier.pricePerTicket;
      } else {
        return res.status(400).json({
          success: false,
          error: 'No pricing tier found for this quantity'
        });
      }
    }

    const totalPrice = pricePerTicket * qty;

    res.json({
      success: true,
      data: {
        quantity: qty,
        pricePerTicket,
        totalPrice,
        modelType: revenueConfig.modelType
      }
    });
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/revenue/stats
// @desc    Get revenue statistics
// @access  Private (Admin only)
router.get('/stats', protect, checkPermission('VIEW_FINANCIALS'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get transaction stats
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });

    const totalRevenue = transactions
      .filter(t => t.status === 'SUCCESS')
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, '')), 0);

    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(t => t.status === 'SUCCESS').length;

    // Get ticket stats
    const tickets = await prisma.ticketHistoryItem.count({
      where: {
        createdAt: {
          gte: startDate
        },
        status: 'CONFIRMED'
      }
    });

    res.json({
      success: true,
      data: {
        period,
        totalRevenue,
        totalTransactions,
        successfulTransactions,
        totalTickets: tickets,
        successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0
      }
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;


