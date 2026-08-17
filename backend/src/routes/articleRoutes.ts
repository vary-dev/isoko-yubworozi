import express from 'express';
import { createArticle, getArticles } from '../controllers/articleController';
import { uploadImage } from '../middleware/upload';

const router = express.Router();

// POST: /api/articles (Uploads one image named 'image')
router.post('/', uploadImage.single('image'), createArticle);

// GET: /api/articles
router.get('/', getArticles);

export default router;