import express from 'express';
import { 
  getPendingRequests, 
  updateRequestStatus 
} from '../controllers/consentController.js'; // Controller se functions lao
import pool from '../config/db.js';

const router = express.Router();

// 1. Consumer request bhejega (Jo tune pehle likha tha)
router.post('/request', async (req, res) => {
  const { consumer_id, owner_id, record_id, purpose } = req.body;
  try {
    await pool.execute(
      'INSERT INTO consents (consumer_id, owner_id, record_id, purpose) VALUES (?, ?, ?, ?)',
      [consumer_id, owner_id, record_id, purpose]
    );
    res.status(201).json({ message: "Request sent successfully! 🚀" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Owner apni pending requests dekhega
router.get('/pending/:ownerId', getPendingRequests);

// 3. Owner request approve ya reject karega
router.put('/update-status', updateRequestStatus);

export default router;