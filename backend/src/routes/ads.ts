import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { protect, checkPermission } from '../middleware/auth';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync('uploads/ads/', { recursive: true });
    cb(null, 'uploads/ads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ad-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/ads
// @desc    Get all ads
// @access  Public
router.get('/', async (req, res) => {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: ads
    });
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/ads/:id
// @desc    Get ad by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await prisma.ad.findUnique({
      where: { id }
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'Ad not found'
      });
    }

    res.json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/ads
// @desc    Create new ad
// @access  Private (Admin only)
router.post('/', protect, checkPermission('MANAGE_ADS'), upload.single('image'), [
  body('location').isIn(['SPOT_1', 'SPOT_2', 'SPOT_3', 'SPOT_4', 'SPOT_POPUP', 'SPOT_BOTTOM_1', 'SPOT_BOTTOM_2', 'SPOT_BOTTOM_3']),
  body('title').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
  body('ctaText').optional().trim(),
  body('linkUrl').optional().isURL(),
  body('colorFrom').optional().trim(),
  body('colorTo').optional().trim(),
  body('iconName').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
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
      location,
      title,
      description,
      ctaText = 'View',
      linkUrl = '',
      colorFrom,
      colorTo,
      iconName = 'Sparkles',
      isActive = true,
      startDate,
      endDate
    } = req.body;

    const imageUrl = req.file ? `/uploads/ads/${req.file.filename}` : req.body.imageUrl;

    const ad = await prisma.ad.create({
      data: {
        location,
        title,
        description,
        ctaText,
        linkUrl,
        imageUrl,
        colorFrom,
        colorTo,
        iconName,
        isActive,
        startDate,
        endDate
      }
    });

    res.status(201).json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/ads/:id
// @desc    Update ad
// @access  Private (Admin only)
router.put('/:id', protect, checkPermission('MANAGE_ADS'), upload.single('image'), [
  body('location').optional().isIn(['SPOT_1', 'SPOT_2', 'SPOT_3', 'SPOT_4', 'SPOT_POPUP', 'SPOT_BOTTOM_1', 'SPOT_BOTTOM_2', 'SPOT_BOTTOM_3']),
  body('title').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim().isLength({ min: 1 }),
  body('ctaText').optional().trim(),
  body('linkUrl').optional().isURL(),
  body('colorFrom').optional().trim(),
  body('colorTo').optional().trim(),
  body('iconName').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
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
    const updateData: any = { ...req.body };

    // Handle image upload
    if (req.file) {
      updateData.imageUrl = `/uploads/ads/${req.file.filename}`;
    }

    const ad = await prisma.ad.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('Update ad error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Ad not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/ads/:id
// @desc    Delete ad
// @access  Private (Admin only)
router.delete('/:id', protect, checkPermission('MANAGE_ADS'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ad.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Delete ad error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Ad not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PATCH /api/ads/:id/toggle
// @desc    Toggle ad active status
// @access  Private (Admin only)
router.patch('/:id/toggle', protect, checkPermission('MANAGE_ADS'), async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await prisma.ad.findUnique({
      where: { id },
      select: { isActive: true }
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'Ad not found'
      });
    }

    const updatedAd = await prisma.ad.update({
      where: { id },
      data: { isActive: !ad.isActive }
    });

    res.json({
      success: true,
      data: updatedAd
    });
  } catch (error) {
    console.error('Toggle ad status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
