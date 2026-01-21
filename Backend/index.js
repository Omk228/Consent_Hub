import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';

// Routes Imports
import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/recordRoutes.js'; // Ye banayenge hum
import consentRoutes from './routes/consentRoutes.js'; // Ye bhi
import auditRoutes from './routes/auditRoutes.js'; // Audit logs ke liye
import consumerRoutes from './routes/consumerRoutes.js';

dotenv.config();
console.log("JWT_SECRET from .env:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded"); // NEW LOG
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Database Connection Test logic
const testDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Database Connected! ✅");
    connection.release(); // Connection pool mein wapas bhej do
  } catch (err) {
    console.error("Database Connection Failed! ❌ Error:", err.message);
  }
};
testDB();

// 2. API Routes Setup
app.use('/api/auth', authRoutes);         // Login/Register ke liye
app.use('/api/owner', recordRoutes);    // Owner records manage karne ke liye
app.use('/api/consents', consentRoutes);  // Requests aur Approval flow ke liye
app.use('/api/owner/audit-logs', auditRoutes);       // Logs check karne ke liye
app.use('/api/consumer', consumerRoutes); // Consumer routes ke liye

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Bhai, server mein kuch locha ho gaya!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});