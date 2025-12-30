import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './Routes/auth.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();


app.use(cors()); // Remove the options for now


app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products')

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});