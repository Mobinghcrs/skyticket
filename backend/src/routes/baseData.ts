import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server';
import { protect, checkPermission } from '../middleware/auth';

const router = express.Router();

// ===== AIRLINES =====

// @route   GET /api/base-data/airlines
// @desc    Get all airlines
// @access  Public
router.get('/airlines', async (req, res) => {
  try {
    const airlines = await prisma.airline.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: airlines
    });
  } catch (error) {
    console.error('Get airlines error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/base-data/airlines
// @desc    Create new airline
// @access  Private (Admin only)
router.post('/airlines', protect, checkPermission('MANAGE_BASE_DATA'), [
  body('name').trim().isLength({ min: 1 }),
  body('code').trim().isLength({ min: 1, max: 10 }),
  body('logoUrl').optional({ values: 'falsy' }).isString()
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

    const { name, code, logoUrl } = req.body;
    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();

    // Check if code or name already exists
    const existingAirline = await prisma.airline.findFirst({
      where: {
        OR: [
          { code: cleanCode },
          { name: cleanName }
        ]
      }
    });

    if (existingAirline) {
      const updated = await prisma.airline.update({
        where: { id: existingAirline.id },
        data: {
          name: cleanName,
          code: cleanCode,
          logoUrl: logoUrl || existingAirline.logoUrl
        }
      });
      return res.status(200).json({
        success: true,
        data: updated
      });
    }

    const airline = await prisma.airline.create({
      data: {
        id: `air_${cleanCode.toLowerCase()}`,
        name: cleanName,
        code: cleanCode,
        logoUrl: logoUrl || null
      }
    });

    res.status(201).json({
      success: true,
      data: airline
    });
  } catch (error: any) {
    console.error('Create airline error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Server error'
    });
  }
});

// @route   PUT /api/base-data/airlines/:id
// @desc    Update airline
// @access  Private (Admin only)
router.put('/airlines/:id', protect, checkPermission('MANAGE_BASE_DATA'), [
  body('name').optional().trim().isLength({ min: 1 }),
  body('code').optional().trim().isLength({ min: 1, max: 10 }),
  body('logoUrl').optional({ values: 'falsy' }).isString()
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
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;

    if (updateData.code) {
      updateData.code = updateData.code.trim().toUpperCase();
    }
    if (updateData.name) {
      updateData.name = updateData.name.trim();
    }

    // Find existing airline by ID first
    let existingAirline = await prisma.airline.findUnique({
      where: { id }
    });

    // Fallback: match by code if ID was a numeric catalog ID (like "3") or mismatched
    if (!existingAirline && updateData.code) {
      existingAirline = await prisma.airline.findFirst({
        where: { code: updateData.code }
      });
    }

    // Fallback: match by name
    if (!existingAirline && updateData.name) {
      existingAirline = await prisma.airline.findFirst({
        where: { name: updateData.name }
      });
    }

    let airline;
    if (existingAirline) {
      airline = await prisma.airline.update({
        where: { id: existingAirline.id },
        data: updateData
      });
    } else {
      // Upsert: Create airline if not found
      airline = await prisma.airline.create({
        data: {
          id: id && id.startsWith('air_') ? id : `air_${(updateData.code || Date.now().toString()).toLowerCase()}`,
          name: updateData.name || 'Airline',
          code: (updateData.code || 'AIR').toUpperCase(),
          logoUrl: updateData.logoUrl || null
        }
      });
    }

    res.json({
      success: true,
      data: airline
    });
  } catch (error: any) {
    console.error('Update airline error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Server error'
    });
  }
});

// @route   DELETE /api/base-data/airlines/:id
// @desc    Delete airline
// @access  Private (Admin only)
router.delete('/airlines/:id', protect, checkPermission('MANAGE_BASE_DATA'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.airline.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Airline deleted successfully'
    });
  } catch (error) {
    console.error('Delete airline error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Airline not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ===== AIRPORTS =====

// @route   GET /api/base-data/airports
// @desc    Get all airports
// @access  Public
router.get('/airports', async (req, res) => {
  try {
    const airports = await prisma.airport.findMany({
      orderBy: { city: 'asc' }
    });

    res.json({
      success: true,
      data: airports
    });
  } catch (error) {
    console.error('Get airports error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/base-data/airports
// @desc    Create new airport
// @access  Private (Admin only)
router.post('/airports', protect, checkPermission('MANAGE_BASE_DATA'), [
  body('name').trim().isLength({ min: 1 }),
  body('code').trim().isLength({ min: 3, max: 3 }).isUppercase(),
  body('city').trim().isLength({ min: 1 }),
  body('country').trim().isLength({ min: 1 })
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

    const { name, code, city, country } = req.body;

    // Check if code already exists
    const existingAirport = await prisma.airport.findUnique({
      where: { code }
    });

    if (existingAirport) {
      return res.status(400).json({
        success: false,
        error: 'Airport code already exists'
      });
    }

    const airport = await prisma.airport.create({
      data: { name, code, city, country }
    });

    res.status(201).json({
      success: true,
      data: airport
    });
  } catch (error) {
    console.error('Create airport error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/base-data/airports/:id
// @desc    Update airport
// @access  Private (Admin only)
router.put('/airports/:id', protect, checkPermission('MANAGE_BASE_DATA'), [
  body('name').optional().trim().isLength({ min: 1 }),
  body('code').optional().trim().isLength({ min: 3, max: 3 }).isUppercase(),
  body('city').optional().trim().isLength({ min: 1 }),
  body('country').optional().trim().isLength({ min: 1 })
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

    // Check if code conflicts
    if (updateData.code) {
      const existingAirport = await prisma.airport.findFirst({
        where: {
          code: updateData.code,
          id: { not: id }
        }
      });

      if (existingAirport) {
        return res.status(400).json({
          success: false,
          error: 'Another airport with this code already exists'
        });
      }
    }

    const airport = await prisma.airport.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: airport
    });
  } catch (error) {
    console.error('Update airport error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Airport not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/base-data/airports/:id
// @desc    Delete airport
// @access  Private (Admin only)
router.delete('/airports/:id', protect, checkPermission('MANAGE_BASE_DATA'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.airport.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Airport deleted successfully'
    });
  } catch (error) {
    console.error('Delete airport error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Airport not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ===== FLIGHTS =====

// @route   GET /api/base-data/flights
// @desc    Get all saved flights
// @access  Public
router.get('/flights', async (req, res) => {
  try {
    const flights = await prisma.savedFlight.findMany({
      include: {
        airline: true,
        originAirport: true,
        destAirport: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: flights
    });
  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/base-data/flights
// @desc    Create new saved flight
// @access  Private (Admin only)
router.post('/flights', protect, checkPermission('MANAGE_BASE_DATA'), [
  body('flightNumber').trim().isLength({ min: 1 }),
  body('airlineId').trim().isLength({ min: 1 }),
  body('originCode').trim().isLength({ min: 3, max: 3 }).isUppercase(),
  body('destCode').trim().isLength({ min: 3, max: 3 }).isUppercase(),
  body('departureTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('arrivalTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('date').isISO8601()
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

    const { flightNumber, airlineId, originCode, destCode, departureTime, arrivalTime, date } = req.body;

    // Verify airline exists
    const airline = await prisma.airline.findUnique({
      where: { id: airlineId }
    });

    if (!airline) {
      return res.status(400).json({
        success: false,
        error: 'Invalid airline ID'
      });
    }

    // Verify airports exist
    const [originAirport, destAirport] = await Promise.all([
      prisma.airport.findUnique({ where: { code: originCode } }),
      prisma.airport.findUnique({ where: { code: destCode } })
    ]);

    if (!originAirport || !destAirport) {
      return res.status(400).json({
        success: false,
        error: 'Invalid airport code(s)'
      });
    }

    const flight = await prisma.savedFlight.create({
      data: {
        flightNumber,
        airlineId,
        originCode,
        destCode,
        departureTime,
        arrivalTime,
        date
      },
      include: {
        airline: true,
        originAirport: true,
        destAirport: true
      }
    });

    res.status(201).json({
      success: true,
      data: flight
    });
  } catch (error) {
    console.error('Create flight error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/base-data/flights/:id
// @desc    Update flight
// @access  Private (Admin only)
router.put('/flights/:id', protect, checkPermission('MANAGE_BASE_DATA'), [
  body('flightNumber').optional().trim().isLength({ min: 1 }),
  body('airlineId').optional().trim().isLength({ min: 1 }),
  body('originCode').optional().trim().isLength({ min: 3, max: 3 }).isUppercase(),
  body('destCode').optional().trim().isLength({ min: 3, max: 3 }).isUppercase(),
  body('departureTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('arrivalTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('date').optional().isISO8601()
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

    // Verify airline exists if updating
    if (updateData.airlineId) {
      const airline = await prisma.airline.findUnique({
        where: { id: updateData.airlineId }
      });

      if (!airline) {
        return res.status(400).json({
          success: false,
          error: 'Invalid airline ID'
        });
      }
    }

    // Verify airports exist if updating
    if (updateData.originCode) {
      const airport = await prisma.airport.findUnique({
        where: { code: updateData.originCode }
      });

      if (!airport) {
        return res.status(400).json({
          success: false,
          error: 'Invalid origin airport code'
        });
      }
    }

    if (updateData.destCode) {
      const airport = await prisma.airport.findUnique({
        where: { code: updateData.destCode }
      });

      if (!airport) {
        return res.status(400).json({
          success: false,
          error: 'Invalid destination airport code'
        });
      }
    }

    const flight = await prisma.savedFlight.update({
      where: { id },
      data: updateData,
      include: {
        airline: true,
        originAirport: true,
        destAirport: true
      }
    });

    res.json({
      success: true,
      data: flight
    });
  } catch (error) {
    console.error('Update flight error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Flight not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/base-data/flights/:id
// @desc    Delete flight
// @access  Private (Admin only)
router.delete('/flights/:id', protect, checkPermission('MANAGE_BASE_DATA'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.savedFlight.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    console.error('Delete flight error:', error);

    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Flight not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
