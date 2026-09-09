import express from 'express';
import { addVideo, getVideos, getVideoById, updateVideo, deleteVideo } from '../controllers/videoController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// POST: /api/videos
router.post('/', protect, adminOnly, addVideo);

// GET: /api/videos
router.get('/', getVideos);

// GET: /api/videos/:id
router.get('/:id', getVideoById);

// PUT: /api/videos/:id
router.put('/:id', protect, adminOnly, updateVideo);

// DELETE: /api/videos/:id
router.delete('/:id', protect, adminOnly, deleteVideo);

export default router;
