import express from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Owner naya record add karega
router.post('/records', authMiddleware, async (req, res) => {
  const { record_name, category, content } = req.body;
  const owner_id = req.user.id; // Token se extract kiya gaya ID

  try {
    const [result] = await pool.execute(
      'INSERT INTO records (owner_id, record_name, category, content) VALUES (?, ?, ?, ?)',
      [owner_id, record_name, category || 'General', JSON.stringify(content)]
    );
    res.status(201).json({ message: "Record added successfully! ✅", id: result.insertId });
  } catch (error) {
    console.error("Record Add Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Owner ke sabhi records fetch karega
router.get('/my-records', authMiddleware, async (req, res) => {
  const owner_id = req.user.id;
  try {
    const [rows] = await pool.execute(
      'SELECT id, record_name as name, category, content, created_at as created, created_at as lastAccessed, 0 as activeConsents FROM records WHERE owner_id = ?',
      [owner_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;