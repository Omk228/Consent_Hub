import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
  getPendingRequests, 
  updateRequestStatus, 
  getAllOwnerRequests 
} from '../controllers/consentController.js';
// Naya import audit logs ke liye
import { getAuditLogs } from '../controllers/auditController.js'; 

const router = express.Router();

// 1. Pending requests dekhne ke liye
router.get('/pending', authMiddleware, getPendingRequests);

// 1.1. Saari requests dekhne ke liye (Access History page ke liye)
router.get('/all-requests', authMiddleware, getAllOwnerRequests);

// 2. Approve ya Reject karne ke liye
router.put('/update-status', authMiddleware, updateRequestStatus);

// 3. FIXED: Audit Trail/Activity fetch karne ke liye endpoint
// authMiddleware req.user set karta hai
router.get('/audit-logs', authMiddleware, getAuditLogs);

export default router;