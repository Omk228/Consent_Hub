import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js'; // Jo hum abhi banayenge

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON data read karne ke liye

// Test Route
app.get('/', (req, res) => {
  res.send('Bhai, Backend chal raha hai! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});