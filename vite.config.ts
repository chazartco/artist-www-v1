import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import fs from 'fs';
import path from 'path';

const dataDir = './data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        const router = express.Router();
        server.middlewares.use(express.json({ limit: '50mb' }));

        // API endpoints
        router.get('/api/content', (_, res) => {
          try {
            const dataFile = path.join(dataDir, 'content.json');
            if (!fs.existsSync(dataFile)) {
              const defaultData = {
                artworks: [],
                exhibitions: [],
                about: {},
                theme: null,
                adminPassword: process.env.VITE_ADMIN_PASSWORD || 'admin123',
                password_changed: false
              };
              fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(defaultData));
              return;
            }
            const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read content' }));
          }
        });

        router.post('/api/content', (req, res) => {
          try {
            const dataFile = path.join(dataDir, 'content.json');
            fs.writeFileSync(dataFile, JSON.stringify(req.body, null, 2));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to save content' }));
          }
        });

        server.middlewares.use(router);
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});