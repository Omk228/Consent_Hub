import express from 'express';
import { searchOwner, getOwnerPublicRecords, getAvailableOwners, getMyRequests, requestAccess } from '../controllers/consumerController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Import authMiddleware

const router = express.Router();

router.get('/search', searchOwner); // Public route
router.get('/owner-records/:ownerId', authMiddleware, getOwnerPublicRecords); // Authenticated
router.get('/available-owners', authMiddleware, getAvailableOwners); // Authenticated
router.get('/my-requests', authMiddleware, getMyRequests); // Authenticated
router.post('/request-access', authMiddleware, requestAccess); // Authenticated

export default router;