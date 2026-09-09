import express from 'express';
import { 
    createBook, 
    getBooks, 
    getBookById, 
    deleteBook,
    updateBook,
    getAdminBooks,
} from '../controllers/bookController';
import { uploadCombined } from '../middleware/upload';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/books
router.post(
  '/', protect, adminOnly,
  uploadCombined.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'fileUrl', maxCount: 1 }
  ]), 
  createBook
);

// @route   GET /api/books
router.get('/', getBooks);

router.get('/admin/all', protect, adminOnly, getAdminBooks);

// @route   GET /api/books/:id
router.get('/:id', getBookById);

// @route   PUT /api/books/:id
router.put(
  '/:id', protect, adminOnly,
  uploadCombined.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'fileUrl', maxCount: 1 }
  ]),
  updateBook
);

// @route   DELETE /api/books/:id
router.delete('/:id', protect, adminOnly, deleteBook);

export default router;
