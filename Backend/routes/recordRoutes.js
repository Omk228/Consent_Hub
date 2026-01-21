import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateRecord, deleteRecord } from '../controllers/recordController.js';
import { addRecord, getMyRecords } from '../controllers/recordController.js'; // Assuming you'll move these to controller

const router = express.Router();

// Owner naya record add karega
router.post('/records', authMiddleware, addRecord);

// Owner ke sabhi records fetch karega
router.get('/my-records', authMiddleware, getMyRecords);

// Owner record update karega
router.put('/records/:id', authMiddleware, updateRecord);

// Owner record delete karega
router.delete('/records/:id', authMiddleware, deleteRecord);

export default router;