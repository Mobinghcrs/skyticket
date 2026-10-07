import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { protect, checkPermission } from '../middleware/auth';

const router = express.Router();

// ===== FOOTER CONFIG =====

// @route   GET /api/settings/footer
// @desc    Get footer configuration
// @access  Public
router.get('/footer', async (req, res) => {
  try {
    let footerConfig = await prisma.footerConfig.findFirst();

    if (!footerConfig) {
      // Create default footer config if not exists
      footerConfig = await prisma.footerConfig.create({
        data: {
          description: 'Leading ticket booking service for airlines worldwide.',
          address: '123 Airport Road, Aviation City, AC 12345',
          phone: '+1 (555) 123-4567',
          email: 'support@skyticket.com',
          copyright: `© ${new Date().getFullYear()} SkyTicket. All rights reserved.`,
          facebook: 'https://facebook.com/skyticket',
          twitter: 'https://twitter.com/skyticket',
          instagram: 'https://instagram.com/skyticket',
          linkedin: 'https://linkedin.com/company/skyticket'
        }
      });
    }

    res.json({
      success: true,
      data: footerConfig
    });
  } catch (error) {
    console.error('Get footer config error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/settings/footer
// @desc    Update footer configuration
// @access  Private (Admin only)
router.put('/footer', protect, checkPermission('MANAGE_SETTINGS'), [
  body('description').optional().trim(),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail(),
  body('copyright').optional().trim(),
  body('facebook').optional({ values: 'falsy' }).isURL(),
  body('twitter').optional({ values: 'falsy' }).isURL(),
  body('instagram').optional({ values: 'falsy' }).isURL(),
  body('linkedin').optional({ values: 'falsy' }).isURL()
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

    let footerConfig = await prisma.footerConfig.findFirst();

    if (footerConfig) {
      footerConfig = await prisma.footerConfig.update({
        where: { id: footerConfig.id },
        data: req.body
      });
    } else {
      footerConfig = await prisma.footerConfig.create({
        data: req.body
      });
    }

    res.json({
      success: true,
      data: footerConfig
    });
  } catch (error) {
    console.error('Update footer config error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ===== STATIC PAGES =====

// @route   GET /api/settings/static-pages
// @desc    Get all static pages
// @access  Public
router.get(['/static-pages', '/pages'], async (req, res) => {
  try {
    const staticPages = await prisma.staticPage.findMany({
      orderBy: { title: 'asc' }
    });

    res.json({
      success: true,
      data: staticPages
    });
  } catch (error) {
    console.error('Get static pages error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/settings/static-pages/:slug
// @desc    Get static page by slug
// @access  Public
router.get(['/static-pages/:slug', '/pages/:slug'], async (req, res) => {
  try {
    const { slug } = req.params;

    const staticPage = await prisma.staticPage.findUnique({
      where: { slug }
    });

    if (!staticPage) {
      return res.status(404).json({
        success: false,
        error: 'Static page not found'
      });
    }

    res.json({
      success: true,
      data: staticPage
    });
  } catch (error) {
    console.error('Get static page error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/settings/static-pages
// @desc    Create new static page
// @access  Private (Admin only)
router.post('/static-pages', protect, checkPermission('MANAGE_SETTINGS'), [
  body('slug').trim().isLength({ min: 1 }).matches(/^[a-z0-9-]+$/),
  body('title').trim().isLength({ min: 1 }),
  body('content').trim().isLength({ min: 1 })
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

    const { slug, title, content } = req.body;

    // Check if slug already exists
    const existingPage = await prisma.staticPage.findUnique({
      where: { slug }
    });

    if (existingPage) {
      return res.status(400).json({
        success: false,
        error: 'Static page with this slug already exists'
      });
    }

    const staticPage = await prisma.staticPage.create({
      data: { slug, title, content }
    });

    res.status(201).json({
      success: true,
      data: staticPage
    });
  } catch (error) {
    console.error('Create static page error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/settings/static-pages/:id
// @desc    Update static page
// @access  Private (Admin only)
router.put('/static-pages/:id', protect, checkPermission('MANAGE_SETTINGS'), [
  body('slug').optional().trim().isLength({ min: 1 }).matches(/^[a-z0-9-]+$/),
  body('title').optional().trim().isLength({ min: 1 }),
  body('content').optional().trim().isLength({ min: 1 })
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

    // Check if slug conflicts
    if (updateData.slug) {
      const existingPage = await prisma.staticPage.findFirst({
        where: {
          slug: updateData.slug,
          id: { not: id }
        }
      });

      if (existingPage) {
        return res.status(400).json({
          success: false,
          error: 'Another static page with this slug already exists'
        });
      }
    }

    const staticPage = await prisma.staticPage.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: staticPage
    });
  } catch (error) {
    console.error('Update static page error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Static page not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/settings/static-pages/:id
// @desc    Delete static page
// @access  Private (Admin only)
router.delete('/static-pages/:id', protect, checkPermission('MANAGE_SETTINGS'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.staticPage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Static page deleted successfully'
    });
  } catch (error) {
    console.error('Delete static page error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Static page not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ===== TICKET PRICING CONFIG =====

// @route   GET /api/settings/ticket-pricing
// @desc    Get ticket pricing configuration
// @access  Public
router.get('/ticket-pricing', async (req, res) => {
  try {
    let pricing = await prisma.ticketPricingConfig.findFirst();
    if (!pricing) {
      pricing = await prisma.ticketPricingConfig.create({
        data: {
          defaultCurrency: 'IRR',
          domesticPriceIrr: 500000,
          domesticPriceUsd: 10,
          internationalPriceIrr: 1500000,
          internationalPriceUsd: 25,
          exchangeRateUsdToIrr: 900000,
          customAirlinePrices: [
            { id: 'ap_1', airlineCode: 'W5', airlineName: 'Mahan Air (هواپیمایی ماهان)', priceIrr: 600000, priceUsd: 12, isActive: true },
            { id: 'ap_2', airlineCode: 'IR', airlineName: 'Iran Air (هما ایران ایر)', priceIrr: 550000, priceUsd: 11, isActive: true },
            { id: 'ap_3', airlineCode: 'TK', airlineName: 'Turkish Airlines (ترکیش ایرلاینز)', priceIrr: 2000000, priceUsd: 35, isActive: true },
            { id: 'ap_4', airlineCode: 'EK', airlineName: 'Emirates (هواپیمایی امارات)', priceIrr: 2500000, priceUsd: 40, isActive: true },
            { id: 'ap_5', airlineCode: 'FZ', airlineName: 'Flydubai (فلای دبی)', priceIrr: 1800000, priceUsd: 30, isActive: true },
            { id: 'ap_6', airlineCode: 'QR', airlineName: 'Qatar Airways (قطر ایرویز)', priceIrr: 2500000, priceUsd: 40, isActive: true }
          ]
        }
      });
    }

    res.json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error('Get ticket pricing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/settings/ticket-pricing
// @desc    Update ticket pricing configuration
// @access  Private (Admin only)
router.put('/ticket-pricing', protect, checkPermission('MANAGE_SETTINGS'), async (req, res) => {
  try {
    const {
      defaultCurrency = 'IRR',
      domesticPriceIrr = 500000,
      domesticPriceUsd = 10,
      internationalPriceIrr = 1500000,
      internationalPriceUsd = 25,
      exchangeRateUsdToIrr = 900000,
      customAirlinePrices = []
    } = req.body;

    let existing = await prisma.ticketPricingConfig.findFirst();

    const payload = {
      defaultCurrency,
      domesticPriceIrr: Number(domesticPriceIrr) || 0,
      domesticPriceUsd: Number(domesticPriceUsd) || 0,
      internationalPriceIrr: Number(internationalPriceIrr) || 0,
      internationalPriceUsd: Number(internationalPriceUsd) || 0,
      exchangeRateUsdToIrr: Number(exchangeRateUsdToIrr) || 0,
      customAirlinePrices: Array.isArray(customAirlinePrices) ? customAirlinePrices : [],
      updatedAt: new Date().toISOString()
    };

    let result;
    if (existing) {
      result = await prisma.ticketPricingConfig.update({
        where: { id: existing.id },
        data: payload
      });
    } else {
      result = await prisma.ticketPricingConfig.create({
        data: payload
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Update ticket pricing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;

