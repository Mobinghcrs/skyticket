import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { protect, checkPermission, optionalProtect } from '../middleware/auth';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync('uploads/blog/', { recursive: true });
    cb(null, 'uploads/blog/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
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

// @route   GET /api/blog
// @desc    Get all blog posts
// @access  Public for published posts, Private for all
router.get('/', optionalProtect, async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    let whereClause: any = {};

    // If not authenticated, only show published posts
    if (!req.user) {
      whereClause.status = 'PUBLISHED';
    } else if (status) {
      whereClause.status = status;
    }

    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const total = await prisma.blogPost.count({ where: whereClause });

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/blog/:id
// @desc    Get blog post by ID
// @access  Public for published posts, Private for all
router.get('/:id', optionalProtect, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Check if user can access draft posts
    if (post.status === 'DRAFT' && !req.user) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/blog
// @desc    Create new blog post
// @access  Private (Admin only)
router.post('/', protect, checkPermission('MANAGE_BLOG'), upload.single('image'), [
  body('title').trim().isLength({ min: 1 }),
  body('excerpt').trim().isLength({ min: 1 }),
  body('content').trim().isLength({ min: 1 }),
  body('author').optional().trim(),
  body('status').optional().isIn(['PUBLISHED', 'DRAFT'])
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
      title,
      excerpt,
      content,
      author = req.user.name,
      status = 'DRAFT'
    } = req.body;

    const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : req.body.imageUrl;
    const date = new Date().toISOString().split('T')[0];

    const post = await prisma.blogPost.create({
      data: {
        title,
        excerpt,
        content,
        author,
        date,
        imageUrl,
        status
      }
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/blog/:id
// @desc    Update blog post
// @access  Private (Admin only)
router.put('/:id', protect, checkPermission('MANAGE_BLOG'), upload.single('image'), [
  body('title').optional().trim().isLength({ min: 1 }),
  body('excerpt').optional().trim().isLength({ min: 1 }),
  body('content').optional().trim().isLength({ min: 1 }),
  body('author').optional().trim(),
  body('status').optional().isIn(['PUBLISHED', 'DRAFT'])
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
      updateData.imageUrl = `/uploads/blog/${req.file.filename}`;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Update blog post error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog post
// @access  Private (Admin only)
router.delete('/:id', protect, checkPermission('MANAGE_BLOG'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog post error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
