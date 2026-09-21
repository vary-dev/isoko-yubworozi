import express from 'express';
import { latestChannelVideos, syncChannelVideos } from '../controllers/youtubeController';
import { adminOnly, protect } from '../middleware/auth';

const router = express.Router();
router.get('/latest', latestChannelVideos);
router.post('/sync', protect, adminOnly, syncChannelVideos);
export default router;
