import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createInMemPrismaClient } from './db/inMemoryPrisma';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import ticketRoutes from './routes/tickets';
import passengerRoutes from './routes/passengers';
import baseDataRoutes from './routes/baseData';
import adRoutes from './routes/ads';
import blogRoutes from './routes/blog';
import settingsRoutes from './routes/settings';
import revenueRoutes from './routes/revenue';
import { bootstrapDefaults } from './services/bootstrapService';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Prisma: in-memory store
export const prisma = createInMemPrismaClient();

// Middleware - allow iframe embedding for AI Studio preview
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  frameguard: false
}));

app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting
const isLocalRequest = (ip?: string) => {
  if (!ip) return false;
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProduction && isLocalRequest(req.ip),
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/assets/proxy', async (req, res, next) => {
  try {
    const rawUrl = String(req.query.url || '');
    const targetUrl = new URL(rawUrl);

    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      return res.status(400).json({ success: false, error: 'Unsupported asset URL' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: 'Asset request failed' });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return res.status(415).json({ success: false, error: 'Asset is not an image' });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(413).json({ success: false, error: 'Asset is too large' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/base-data', baseDataRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/revenue', revenueRoutes);

// Error handling middleware for /api routes only
app.use('/api', notFound);
app.use(errorHandler);

// Start server function
export async function startStandaloneServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    await bootstrapDefaults();
    console.log('✅ Default users and permissions are ready');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

if (process.env.RUN_STANDALONE === 'true') {
  startStandaloneServer();
}

export { app };
export default app;
