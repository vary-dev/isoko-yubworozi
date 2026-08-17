import express from 'express';
import { 
    createBook, 
    getBooks, 
    getBookById, 
    deleteBook,
    updateBook 
} from '../controllers/bookController';
import { uploadCombined } from '../middleware/upload';

const router = express.Router();

// @route   POST /api/books
router.post(
  '/', 
  uploadCombined.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'fileUrl', maxCount: 1 }
  ]), 
  createBook
);

// @route   GET /api/books
router.get('/', getBooks);

// @route   GET /api/books/:id
router.get('/:id', getBookById);

// @route   PUT /api/books/:id
router.put(
  '/:id',
  uploadCombined.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'fileUrl', maxCount: 1 }
  ]),
  updateBook
);

// @route   DELETE /api/books/:id
router.delete('/:id', deleteBook);

export default router;
