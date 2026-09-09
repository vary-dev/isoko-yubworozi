import express from 'express';
import { getMedia } from '../controllers/mediaController';
import { adminOnly, protect } from '../middleware/auth';

const router = express.Router();
router.get('/', protect, adminOnly, getMedia);
export default router;
