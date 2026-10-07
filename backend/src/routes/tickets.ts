import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { protect, checkPermission } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/tickets/stats/overview
// @desc    Get ticket statistics
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const whereClause: Record<string, string> = {};

    if (req.user.role !== 'ADMIN') {
      whereClause.userId = req.user.id;
    }

    const [
      totalTickets,
      confirmedTickets,
      cancelledTickets,
      pendingTickets
    ] = await Promise.all([
      prisma.ticketHistoryItem.count({ where: whereClause }),
      prisma.ticketHistoryItem.count({ where: { ...whereClause, status: 'CONFIRMED' } }),
      prisma.ticketHistoryItem.count({ where: { ...whereClause, status: 'CANCELLED' } }),
      prisma.ticketHistoryItem.count({ where: { ...whereClause, status: 'PENDING' } })
    ]);

    res.json({
      success: true,
      data: {
        totalTickets,
        confirmedTickets,
        cancelledTickets,
        pendingTickets,
        totalRevenue: 0
      }
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/tickets
// @desc    Get all tickets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let whereClause: any = {};

    // If not admin, only show user's own tickets
    if (req.user.role !== 'ADMIN') {
      whereClause.userId = req.user.id;
    }

    // Add search filters
    const { search, status, dateFrom, dateTo } = req.query;

    if (search) {
      whereClause.OR = [
        { ticketId: { contains: search as string, mode: 'insensitive' } },
        { passengerName: { contains: search as string, mode: 'insensitive' } },
        { pnr: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (dateFrom || dateTo) {
      whereClause.date = {};
      if (dateFrom) whereClause.date.gte = dateFrom as string;
      if (dateTo) whereClause.date.lte = dateTo as string;
    }

    const tickets = await prisma.ticketHistoryItem.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get ticket by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticketHistoryItem.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check if user can access this ticket
    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this ticket'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Private
router.post('/', protect, checkPermission('ISSUE_TICKET'), [
  body('ticketId').trim().isLength({ min: 1 }),
  body('pnr').trim().isLength({ min: 1 }),
  body('passengerName').trim().isLength({ min: 1 }),
  body('route').trim().isLength({ min: 1 }),
  body('date').trim().isLength({ min: 1 }),
  body('price').trim().isLength({ min: 1 }),
  body('paymentMethod').trim().isLength({ min: 1 }),
  body('status').optional().isIn(['CONFIRMED', 'CANCELLED', 'PENDING'])
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

    const {
      ticketId,
      pnr,
      passengerName,
      route,
      date,
      price,
      paymentMethod,
      status = 'CONFIRMED',
      notes = ''
    } = req.body;

    // Check if ticket ID already exists
    const existingTicket = await prisma.ticketHistoryItem.findUnique({
      where: { ticketId }
    });

    if (existingTicket) {
      return res.status(400).json({
        success: false,
        error: 'Ticket ID already exists'
      });
    }

    // Check user credit if not unlimited
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    let deductionNote = '';

    if (!user?.isUnlimited) {
      if (paymentMethod === 'Free Bonus' && (user?.bonusFreeTickets ?? 0) > 0) {
        await prisma.user.update({
          where: { id: req.user.id },
          data: { bonusFreeTickets: (user?.bonusFreeTickets ?? 0) - 1 }
        });
        deductionNote = 'صدور با استفاده از ۱ بلیت هدیه رایگان';
      } else {
        const isUsd = (req.body.currency === 'USD') || (typeof price === 'string' && (price.includes('$') || price.toLowerCase().includes('usd')));
        const cleanPrice = parseFloat(String(price).replace(/[^0-9.-]+/g, '')) || 0;

        if (cleanPrice > 0) {
          if (isUsd) {
            const giftUsd = Number(user?.giftCreditUsd) || 0;
            const mainUsd = Number(user?.creditUsd) || 0;
            const totalAvailableUsd = giftUsd + mainUsd;

            if (totalAvailableUsd < cleanPrice) {
              return res.status(400).json({
                success: false,
                error: `اعتبار دلاری شما برای صدور این بلیت کافی نیست. مبلغ بلیت: $${cleanPrice} | اعتبار هدیه: $${giftUsd} | اعتبار اصلی: $${mainUsd}`
              });
            }

            // Deduct first from gift credit, then from main credit
            const fromGift = Math.min(giftUsd, cleanPrice);
            const remaining = cleanPrice - fromGift;
            const fromMain = remaining;

            const updatedGiftUsd = Math.max(0, giftUsd - fromGift);
            const updatedMainUsd = Math.max(0, mainUsd - fromMain);

            await prisma.user.update({
              where: { id: req.user.id },
              data: {
                giftCreditUsd: updatedGiftUsd,
                creditUsd: updatedMainUsd
              }
            });

            deductionNote = `کسر دلاری: ${fromGift > 0 ? `$${fromGift} از هدیه` : ''}${fromGift > 0 && fromMain > 0 ? ' و ' : ''}${fromMain > 0 ? `$${fromMain} از اصلی` : ''}`;
          } else {
            // IRR Currency
            const giftIrr = Number(user?.giftCreditIrr ?? user?.giftCredit) || 0;
            const mainIrr = Number(user?.creditIrr ?? user?.credit) || 0;
            const totalAvailableIrr = giftIrr + mainIrr;

            if (totalAvailableIrr < cleanPrice) {
              return res.status(400).json({
                success: false,
                error: `اعتبار ریالی شما برای صدور این بلیت کافی نیست. مبلغ بلیت: ${cleanPrice.toLocaleString()} ریال | اعتبار هدیه: ${giftIrr.toLocaleString()} ریال | اعتبار اصلی: ${mainIrr.toLocaleString()} ریال`
              });
            }

            // Deduct first from gift credit, then from main credit
            const fromGift = Math.min(giftIrr, cleanPrice);
            const remaining = cleanPrice - fromGift;
            const fromMain = remaining;

            const updatedGiftIrr = Math.max(0, giftIrr - fromGift);
            const updatedMainIrr = Math.max(0, mainIrr - fromMain);

            await prisma.user.update({
              where: { id: req.user.id },
              data: {
                giftCredit: updatedGiftIrr,
                giftCreditIrr: updatedGiftIrr,
                credit: updatedMainIrr,
                creditIrr: updatedMainIrr
              }
            });

            deductionNote = `کسر ریالی: ${fromGift > 0 ? `${fromGift.toLocaleString()} ریال از هدیه` : ''}${fromGift > 0 && fromMain > 0 ? ' و ' : ''}${fromMain > 0 ? `${fromMain.toLocaleString()} ریال از اصلی` : ''}`;
          }
        }
      }
    }

    const ticket = await prisma.ticketHistoryItem.create({
      data: {
        ticketId,
        pnr,
        passengerName,
        route,
        date,
        issuedBy: req.user.name,
        status,
        price,
        paymentMethod: deductionNote ? `${paymentMethod} (${deductionNote})` : paymentMethod,
        notes: notes ? `${notes} | ${deductionNote}` : deductionNote,
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            credit: true,
            creditIrr: true,
            creditUsd: true,
            giftCredit: true,
            giftCreditIrr: true,
            giftCreditUsd: true,
            bonusFreeTickets: true,
            isUnlimited: true
          }
        }
      }
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        date,
        amount: price,
        status: 'SUCCESS',
        description: deductionNote || `Ticket Issue #${ticketId}`,
        userId: req.user.id
      }
    });

    res.status(201).json({
      success: true,
      data: ticket,
      ticket,
      deductionNote
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/tickets/:id
// @desc    Update ticket
// @access  Private
router.put('/:id', protect, [
  body('status').optional().isIn(['CONFIRMED', 'CANCELLED', 'PENDING']),
  body('notes').optional().trim()
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

    const { id } = req.params;
    const updateData = req.body;

    // Find ticket first
    const ticket = await prisma.ticketHistoryItem.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check if user can update this ticket
    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this ticket'
      });
    }

    const updatedTicket = await prisma.ticketHistoryItem.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket
// @access  Private (Admin only)
router.delete('/:id', protect, checkPermission('MANAGE_USERS'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ticket exists and belongs to user (unless admin)
    const ticket = await prisma.ticketHistoryItem.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this ticket'
      });
    }

    await prisma.ticketHistoryItem.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;

