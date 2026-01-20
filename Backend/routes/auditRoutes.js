import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

// GET /api/audit
router.get('/', getAuditLogs);

export default router;