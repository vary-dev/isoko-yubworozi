import express from 'express';
import { addVideo, getVideos } from '../controllers/videoController';

const router = express.Router();

// POST: /api/videos
router.post('/', addVideo);

// GET: /api/videos
router.get('/', getVideos);

export default router;