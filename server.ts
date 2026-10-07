import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import rawApp, { app as namedApp, prisma } from './backend/src/server';
import { bootstrapDefaults } from './backend/src/services/bootstrapService';

dotenv.config();

const app: any = namedApp || (rawApp as any)?.default || rawApp;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    await bootstrapDefaults();
    console.log('✅ Default users and permissions are ready');

    if (process.env.NODE_ENV === 'production') {
      const distDir = path.resolve(__dirname, 'dist');
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distDir, 'index.html'));
      });
    } else {
      const vite = await createViteServer({
        server: { middlewareMode: true, host: '0.0.0.0', hmr: false },
        appType: 'spa',
        root: path.resolve(__dirname, 'frontend'),
      });
      app.use(vite.middlewares);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SkyTicket Generator running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
