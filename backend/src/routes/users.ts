import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { protect, authorize } from '../middleware/auth';
import { buildPermissionRelation, replacePermissionRelation } from '../utils/permissions';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        credit: true,
        isUnlimited: true,
        bonusFreeTickets: true,
        permissions: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or self)
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user can access this resource
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        credit: true,
        isUnlimited: true,
        bonusFreeTickets: true,
        permissions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
              
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Admin only)
router.post('/', protect, authorize('ADMIN'), [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('mobile').trim().isLength({ min: 10 }),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['ADMIN', 'AGENT', 'USER']),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  body('bonusFreeTickets').optional().isInt({ min: 0 })
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
      name,
      email,
      mobile,
      password,
      role = 'USER',
      status = 'ACTIVE',
      credit = 0,
      isUnlimited = false,
      bonusFreeTickets = 0
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.default.genSalt(10);
    const hashedPassword = await bcrypt.default.hash(password, salt);

    // Get default permissions
    const permissions = getDefaultPermissions(role);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        role,
        status,
        credit: parseFloat(credit),
        isUnlimited,
        bonusFreeTickets: parseInt(bonusFreeTickets, 10),
        permissions: buildPermissionRelation(permissions)
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        credit: true,
        isUnlimited: true,
        bonusFreeTickets: true,
        permissions: true
      }
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or self)
router.put('/:id', protect, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('mobile').optional().trim().isLength({ min: 10 }),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['ADMIN', 'AGENT', 'USER']),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  body('credit').optional().isNumeric(),
  body('isUnlimited').optional().isBoolean(),
  body('bonusFreeTickets').optional().isInt({ min: 0 })
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

    // Check if user can access this resource
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    const updateData: any = { ...req.body };
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true }
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Only admin can update role and permissions
    if (req.user.role !== 'ADMIN') {
      delete updateData.role;
      delete updateData.permissions;
    }

    if (updateData.email && updateData.email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: updateData.email },
        select: { id: true }
      });

      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }
    }

    // Convert credit to number
    if (updateData.credit !== undefined) {
      updateData.credit = parseFloat(updateData.credit);
    }

    if (updateData.bonusFreeTickets !== undefined) {
      updateData.bonusFreeTickets = parseInt(updateData.bonusFreeTickets, 10);
    }

    // Update permissions if role changed
    if (updateData.role && req.user.role === 'ADMIN') {
      updateData.permissions = replacePermissionRelation(getDefaultPermissions(updateData.role));
    }

    if (updateData.password) {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.default.genSalt(10);
      updateData.password = await bcrypt.default.hash(updateData.password, salt);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        credit: true,
        isUnlimited: true,
        bonusFreeTickets: true,
        permissions: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PATCH /api/users/:id/status
// @desc    Toggle user status
// @access  Private (Admin only)
router.patch('/:id/status', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: newStatus },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true
      }
    });

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Helper function to get default permissions
function getDefaultPermissions(role: string): string[] {
  switch (role) {
    case 'ADMIN':
      return [
        'ISSUE_TICKET',
        'MANAGE_USERS',
        'MANAGE_BASE_DATA',
        'VIEW_FINANCIALS',
        'MANAGE_REVENUE',
        'MANAGE_ADS',
        'MANAGE_SETTINGS',
        'MANAGE_BLOG'
      ];
    case 'AGENT':
      return [
        'ISSUE_TICKET',
        'VIEW_FINANCIALS'
      ];
    case 'USER':
    default:
      return ['ISSUE_TICKET'];
  }
}

export default router;
