import express from 'express';
import { addVideo, getVideos, getVideoById, updateVideo, deleteVideo } from '../controllers/videoController';

const router = express.Router();

// POST: /api/videos
router.post('/', addVideo);

// GET: /api/videos
router.get('/', getVideos);

// GET: /api/videos/:id
router.get('/:id', getVideoById);

// PUT: /api/videos/:id
router.put('/:id', updateVideo);

// DELETE: /api/videos/:id
router.delete('/:id', deleteVideo);

export default router;