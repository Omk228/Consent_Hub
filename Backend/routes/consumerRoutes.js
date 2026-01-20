import express from 'express';
import { searchOwner, getOwnerPublicRecords } from '../controllers/consumerController.js';

const router = express.Router();

router.get('/search', searchOwner); // URL: /api/consumer/search?email=test@test.com
router.get('/owner-records/:ownerId', getOwnerPublicRecords);

export default router;