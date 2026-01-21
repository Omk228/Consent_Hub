import express from 'express';
import { 
  getPendingRequests, 
  updateRequestStatus,
  requestConsent 
} from '../controllers/consentController.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 1. Consumer request bhejega
router.post('/request', authMiddleware, requestConsent); 

router.get('/owner-requests', authMiddleware, getPendingRequests);

// 3. Owner request approve ya reject karega
router.put('/update-status', authMiddleware, updateRequestStatus);

export default router;