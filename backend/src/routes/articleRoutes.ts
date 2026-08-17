import express from 'express';
import { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } from '../controllers/articleController';
import { uploadImage } from '../middleware/upload';

const router = express.Router();

// POST: /api/articles (Uploads one image named 'image')
router.post('/', uploadImage.single('image'), createArticle);

// GET: /api/articles
router.get('/', getArticles);

// GET: /api/articles/:id
router.get('/:id', getArticleById);

// PUT: /api/articles/:id (optional image re-upload)
router.put('/:id', uploadImage.single('image'), updateArticle);

// DELETE: /api/articles/:id
router.delete('/:id', deleteArticle);

export default router;