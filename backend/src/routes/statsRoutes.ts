import express from 'express';
import { getStats, getRecentActivity } from '../controllers/statsController';

const router = express.Router();

// @route   GET /api/stats
router.get('/', getStats);

// @route   GET /api/stats/recent
router.get('/recent', getRecentActivity);

export default router;
