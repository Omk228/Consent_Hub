import express from 'express';
import { 
  getPendingRequests, 
  updateRequestStatus,
  requestConsent // <--- YE MISSING THA, ISKO IMPORT KIYA
} from '../controllers/consentController.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; // <--- YE MISSING THA

const router = express.Router();

// 1. Consumer request bhejega (AuthMiddleware aur Controller Function lagaya hai)
// Ab ye body se 'consumer_id' nahi maangega, token se nikalega
router.post('/request', authMiddleware, requestConsent); 

// 2. Owner apni pending requests dekhega (Isme bhi middleware zaroori hai)
router.get('/pending/:ownerId', authMiddleware, getPendingRequests);

// 3. Owner request approve ya reject karega
router.put('/update-status', authMiddleware, updateRequestStatus);

export default router;