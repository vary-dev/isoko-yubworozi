import express from 'express';
import { getStats, getRecentActivity } from '../controllers/statsController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();
router.use(protect, adminOnly);

// @route   GET /api/stats
router.get('/', getStats);

// @route   GET /api/stats/recent
router.get('/recent', getRecentActivity);

export default router;
