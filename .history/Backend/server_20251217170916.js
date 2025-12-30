import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './Routes/auth.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();

// CORS configuration - for development
app.use(cors({
  origin: true,  // Allow all origins in development
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test routes to verify server is working
app.get('/', (req, res) => {
  res.json({
    message: 'Ecommerce Backend API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      signup: 'POST /api/auth/signup',
      test: 'GET /ping'
    }
  });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    serverTime: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use(req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /ping',
      'GET /health',
      'POST /api/auth/signup'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    message: 'Internal Server Error',
    error: error.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📌 Health check: http://localhost:${PORT}/health`);
  console.log(`📌 Test: http://localhost:${PORT}/ping`);
  console.log(`📌 Signup endpoint: POST http://localhost:${PORT}/api/auth/signup`);
  
  connectDB();
});