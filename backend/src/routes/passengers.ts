import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/passengers
// @desc    Get all saved passengers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;

    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { passportNumber: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const passengers = await prisma.savedPassenger.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: passengers
    });
  } catch (error) {
    console.error('Get passengers error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/passengers/:id
// @desc    Get passenger by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const passenger = await prisma.savedPassenger.findUnique({
      where: { id }
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        error: 'Passenger not found'
      });
    }

    res.json({
      success: true,
      data: passenger
    });
  } catch (error) {
    console.error('Get passenger error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/passengers
// @desc    Create new saved passenger
// @access  Private
router.post('/', protect, [
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('gender').isIn(['Male', 'Female']),
  body('passportNumber').trim().isLength({ min: 1 }),
  body('nationality').trim().isLength({ min: 1 })
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

    const { firstName, lastName, gender, passportNumber, nationality, totalFlights = 0 } = req.body;

    // Check if passport number already exists
    const existingPassenger = await prisma.savedPassenger.findFirst({
      where: { passportNumber }
    });

    if (existingPassenger) {
      return res.status(400).json({
        success: false,
        error: 'Passenger with this passport number already exists'
      });
    }

    const passenger = await prisma.savedPassenger.create({
      data: {
        firstName,
        lastName,
        gender,
        passportNumber,
        nationality,
        totalFlights
      }
    });

    res.status(201).json({
      success: true,
      data: passenger
    });
  } catch (error) {
    console.error('Create passenger error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/passengers/:id
// @desc    Update passenger
// @access  Private
router.put('/:id', protect, [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('gender').optional().isIn(['Male', 'Female']),
  body('passportNumber').optional().trim().isLength({ min: 1 }),
  body('nationality').optional().trim().isLength({ min: 1 }),
  body('totalFlights').optional().isNumeric()
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

    // Check if passport number conflicts with another passenger
    if (updateData.passportNumber) {
      const existingPassenger = await prisma.savedPassenger.findFirst({
        where: {
          passportNumber: updateData.passportNumber,
          id: { not: id }
        }
      });

      if (existingPassenger) {
        return res.status(400).json({
          success: false,
          error: 'Another passenger with this passport number already exists'
        });
      }
    }

    const passenger = await prisma.savedPassenger.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: passenger
    });
  } catch (error) {
    console.error('Update passenger error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Passenger not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/passengers/:id
// @desc    Delete passenger
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.savedPassenger.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Passenger deleted successfully'
    });
  } catch (error) {
    console.error('Delete passenger error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Passenger not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;


