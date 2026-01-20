import express from 'express';
import pool from '../config/db.js';
const router = express.Router();

// Owner naya record add karega
router.post('/add', async (req, res) => {
  const { owner_id, record_name, category, content } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO records (owner_id, record_name, category, content) VALUES (?, ?, ?, ?)',
      [owner_id, record_name, category, JSON.stringify(content)]
    );
    res.status(201).json({ message: "Record added!", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;