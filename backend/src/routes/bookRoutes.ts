import express from 'express';
import { 
    createBook, 
    getBooks, 
    getBookById, 
    deleteBook 
} from '../controllers/bookController';
import { uploadImage } from '../middleware/upload';

const router = express.Router();

// @route   POST /api/books
router.post(
  '/', 
  uploadImage.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'fileUrl', maxCount: 1 }
  ]), 
  createBook
);

// @route   GET /api/books
router.get('/', getBooks);

// @route   GET /api/books/:id
router.get('/:id', getBookById);

// @route   DELETE /api/books/:id
router.delete('/:id', deleteBook);

export default router;