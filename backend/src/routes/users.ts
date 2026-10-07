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
        creditIrr: true,
        creditUsd: true,
        giftCredit: true,
        giftCreditIrr: true,
        giftCreditUsd: true,
        isUnlimited: true,
        bonusFreeTickets: true,
        permissions: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const normalizedUsers = users.map((u: any) => ({
      ...u,
      credit: u.creditIrr ?? u.credit ?? 0,
      creditIrr: u.creditIrr ?? u.credit ?? 0,
      creditUsd: u.creditUsd ?? 0,
      giftCredit: u.giftCreditIrr ?? u.giftCredit ?? 0,
      giftCreditIrr: u.giftCreditIrr ?? u.giftCredit ?? 0,
      giftCreditUsd: u.giftCreditUsd ?? 0
    }));

    res.json({
      success: true,
      data: normalizedUsers
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
        creditIrr: true,
        creditUsd: true,
        giftCredit: true,
        giftCreditIrr: true,
        giftCreditUsd: true,
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
      data: {
        ...user,
        credit: user.creditIrr ?? user.credit ?? 0,
        creditIrr: user.creditIrr ?? user.credit ?? 0,
        creditUsd: user.creditUsd ?? 0,
        giftCredit: user.giftCreditIrr ?? user.giftCredit ?? 0,
        giftCreditIrr: user.giftCreditIrr ?? user.giftCredit ?? 0,
        giftCreditUsd: user.giftCreditUsd ?? 0
      }
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
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('نام کاربر باید حداقل ۲ حرف باشد (Name must be at least 2 characters)'),
  body('email')
    .trim()
    .toLowerCase()
    .custom((val) => {
      if (!val || typeof val !== 'string') return false;
      const clean = val.trim();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) || clean.includes('@');
    })
    .withMessage('فرمت آدرس ایمیل نامعتبر است (Email format is invalid)'),
  body('mobile')
    .trim()
    .customSanitizer((val) => {
      if (!val || typeof val !== 'string') return val;
      return val
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
        .replace(/[\s\-\(\)]/g, '');
    })
    .isLength({ min: 5 })
    .withMessage('شماره موبایل باید حداقل ۵ رقم باشد (Mobile number is required)'),
  body('password')
    .isLength({ min: 4 })
    .withMessage('رمز عبور باید حداقل ۴ کاراکتر باشد (Password must be at least 4 characters)'),
  body('role')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.toUpperCase() : val))
    .isIn(['ADMIN', 'AGENT', 'USER'])
    .withMessage('نقش کاربر نامعتبر است (Role must be ADMIN, AGENT, or USER)'),
  body('status')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.toUpperCase() : val))
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('وضعیت کاربر نامعتبر است (Status must be ACTIVE or INACTIVE)'),
  body('bonusFreeTickets')
    .optional()
    .customSanitizer((val) => parseInt(val, 10) || 0)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const details = errors.array();
      const firstError = details[0]?.msg || 'Validation failed';
      return res.status(400).json({
        success: false,
        error: firstError,
        details
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
      creditIrr,
      creditUsd = 0,
      giftCredit = 0,
      giftCreditIrr,
      giftCreditUsd = 0,
      isUnlimited = false,
      bonusFreeTickets = 0
    } = req.body;

    const normalizedRole = typeof role === 'string' ? role.toUpperCase() : 'USER';
    const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : 'ACTIVE';
    const finalCreditIrr = parseFloat(creditIrr ?? credit) || 0;
    const finalCreditUsd = parseFloat(creditUsd) || 0;
    const finalGiftIrr = parseFloat(giftCreditIrr ?? giftCredit) || 0;
    const finalGiftUsd = parseFloat(giftCreditUsd) || 0;

    // Check if user already exists (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email.toLowerCase(), mode: 'insensitive' } }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'کاربری با این ایمیل از قبل در سیستم وجود دارد (User already exists with this email)'
      });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.default.genSalt(10);
    const hashedPassword = await bcrypt.default.hash(password, salt);

    // Get default permissions
    const permissions = getDefaultPermissions(normalizedRole);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        mobile,
        password: hashedPassword,
        role: normalizedRole,
        status: normalizedStatus,
        credit: finalCreditIrr,
        creditIrr: finalCreditIrr,
        creditUsd: finalCreditUsd,
        giftCredit: finalGiftIrr,
        giftCreditIrr: finalGiftIrr,
        giftCreditUsd: finalGiftUsd,
        isUnlimited: Boolean(isUnlimited),
        bonusFreeTickets: parseInt(bonusFreeTickets, 10) || 0,
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
        creditIrr: true,
        creditUsd: true,
        giftCredit: true,
        giftCreditIrr: true,
        giftCreditUsd: true,
        isUnlimited: true,
        bonusFreeTickets: true,
        permissions: true
      }
    });

    const userResponse = {
      ...user,
      credit: user.creditIrr ?? user.credit ?? 0,
      creditIrr: user.creditIrr ?? user.credit ?? 0,
      creditUsd: user.creditUsd ?? 0,
      giftCredit: user.giftCreditIrr ?? user.giftCredit ?? 0,
      giftCreditIrr: user.giftCreditIrr ?? user.giftCredit ?? 0,
      giftCreditUsd: user.giftCreditUsd ?? 0
    };

    res.status(201).json({
      success: true,
      data: userResponse,
      user: userResponse
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
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('نام کاربر باید حداقل ۲ حرف باشد'),
  body('email')
    .optional()
    .trim()
    .toLowerCase()
    .custom((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || val.includes('@'))
    .withMessage('فرمت آدرس ایمیل نامعتبر است'),
  body('mobile')
    .optional()
    .trim()
    .customSanitizer((val) => {
      if (!val || typeof val !== 'string') return val;
      return val
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
        .replace(/[\s\-\(\)]/g, '');
    }),
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('رمز عبور باید حداقل ۴ کاراکتر باشد'),
  body('role')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.toUpperCase() : val))
    .isIn(['ADMIN', 'AGENT', 'USER']),
  body('status')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.toUpperCase() : val))
    .isIn(['ACTIVE', 'INACTIVE']),
  body('credit').optional().isNumeric(),
  body('isUnlimited').optional().isBoolean(),
  body('bonusFreeTickets').optional().customSanitizer((val) => parseInt(val, 10) || 0)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const details = errors.array();
      const firstError = details[0]?.msg || 'Validation failed';
      return res.status(400).json({
        success: false,
        error: firstError,
        details
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
      if (updateData.creditIrr === undefined) {
        updateData.creditIrr = updateData.credit;
      }
    }

    if (updateData.creditIrr !== undefined) {
      updateData.creditIrr = parseFloat(updateData.creditIrr);
      updateData.credit = updateData.creditIrr;
    }

    if (updateData.creditUsd !== undefined) {
      updateData.creditUsd = parseFloat(updateData.creditUsd);
    }

    if (updateData.giftCredit !== undefined) {
      updateData.giftCredit = parseFloat(updateData.giftCredit);
      if (updateData.giftCreditIrr === undefined) {
        updateData.giftCreditIrr = updateData.giftCredit;
      }
    }

    if (updateData.giftCreditIrr !== undefined) {
      updateData.giftCreditIrr = parseFloat(updateData.giftCreditIrr);
      updateData.giftCredit = updateData.giftCreditIrr;
    }

    if (updateData.giftCreditUsd !== undefined) {
      updateData.giftCreditUsd = parseFloat(updateData.giftCreditUsd);
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
        creditIrr: true,
        creditUsd: true,
        giftCredit: true,
        giftCreditIrr: true,
        giftCreditUsd: true,
        isUnlimited: true,
        bonusFreeTickets: true,
        permissions: true
      }
    });

    res.json({
      success: true,
      data: {
        ...user,
        credit: user.creditIrr ?? user.credit ?? 0,
        creditIrr: user.creditIrr ?? user.credit ?? 0,
        creditUsd: user.creditUsd ?? 0,
        giftCredit: user.giftCreditIrr ?? user.giftCredit ?? 0,
        giftCreditIrr: user.giftCreditIrr ?? user.giftCredit ?? 0,
        giftCreditUsd: user.giftCreditUsd ?? 0
      }
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
