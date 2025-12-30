import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './Routes/auth.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Add a test route for the home page
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 E-commerce API is running!',
    endpoints: {
      signup: 'POST /api/auth/signup'
    }
  });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});