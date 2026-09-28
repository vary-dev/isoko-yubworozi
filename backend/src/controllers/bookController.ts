import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';
import Purchase from '../models/Purchase';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

const isHttpsUrl = (value: unknown) => {
  try { return new URL(String(value)).protocol === 'https:'; } catch { return false; }
};
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const publicBook = (book: any) => {
  const value = book.toObject();
  if (value.isPremium) delete value.fileUrl;
  return value;
};

/**
 * @desc    Create a new book (Admin Only)
 * @route   POST /api/books
 */
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, isPremium, coverImageUrl } = req.body;
    if (!title?.trim() || !description?.trim() || !category?.trim()) {
      return res.status(400).json({ message: 'Title, description and category are required' });
    }
    
    // Explicitly type the files object for TypeScript
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Extract paths from the uploaded files provided by Multer/Cloudinary
    const coverImagePath = files?.['coverImage']?.[0]?.path || (isHttpsUrl(coverImageUrl) ? coverImageUrl : '');
    const fileUrlPath = files?.['fileUrl']?.[0]?.path || '';

    if (!coverImagePath || !fileUrlPath) {
       return res.status(400).json({ message: 'A cover image (upload or library selection) and PDF file are required' });
    }

    const newBook = new Book({
      title,
      description,
      category,
      price: Number(price) || 0,
      coverImage: coverImagePath,
      fileUrl: fileUrlPath,
      isPremium: isPremium === 'true' || isPremium === true 
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error: any) {
    console.error("Upload Error:", error?.message || error);
    res.status(500).json({ message: 'Error uploading book', error: error?.message || error });
  }
};

/**
 * @desc    Get all books
 * @route   GET /api/books
 */
export const getBooks = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.category === 'string' && req.query.category.trim()) filter.category = req.query.category.trim();
    if (typeof req.query.q === 'string' && req.query.q.trim()) {
      const term = new RegExp(escapeRegExp(req.query.q.trim()), 'i');
      filter.$or = [{ title: term }, { description: term }, { category: term }];
    }
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 100);
    const books = await Book.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.status(200).json(books.map(publicBook));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};

/**
 * @desc    Get single book by ID
 * @route   GET /api/books/:id
 */
export const getBookById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid book identifier' });
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(publicBook(book));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error });
  }
};

/**
 * @desc    Delete a book
 * @route   DELETE /api/books/:id
 */
export const deleteBook = async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid book identifier' });
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
};

/**
 * @desc    Update a book
 * @route   PUT /api/books/:id
 */
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, isPremium, coverImageUrl } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid book identifier' });
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = Number(price) || 0;
    if (isPremium !== undefined) updateData.isPremium = isPremium === 'true' || isPremium === true;

    // If new files were uploaded, update their paths
    if (files?.['coverImage']?.[0]?.path) {
      updateData.coverImage = files['coverImage'][0].path;
    } else if (coverImageUrl) {
      if (!isHttpsUrl(coverImageUrl)) return res.status(400).json({ message: 'Cover image URL must use HTTPS' });
      updateData.coverImage = coverImageUrl;
    }
    if (files?.['fileUrl']?.[0]?.path) {
      updateData.fileUrl = files['fileUrl'][0].path;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error });
  }
};

export const getAdminBooks = async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await Book.find().sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin library', error });
  }
};

/** Return a premium file only to the account that owns a verified purchase. */
export const getBookAccess = async (req: AuthRequest, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid book identifier' });
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.isPremium) {
      if (!req.user) return res.status(401).json({ message: 'Sign in to access this premium book' });
      const purchase = await Purchase.exists({ user: req.user!.id, book: book._id, status: 'successful' });
      if (!purchase) return res.status(403).json({ message: 'A verified purchase is required to access this book' });
    }
    res.json({ bookId: book._id, title: book.title, fileUrl: book.fileUrl, access: book.isPremium ? 'purchased' : 'free' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to authorize book access', error });
  }
};

export const getSavedBooks = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id).populate('savedBooks');
  if (!user) return res.status(404).json({ message: 'Account not found' });
  res.json((user.savedBooks || []).map(publicBook));
};

export const toggleSavedBook = async (req: AuthRequest, res: Response) => {
  const requestedBookId = String(req.params.id);
  if (!mongoose.isValidObjectId(requestedBookId)) return res.status(400).json({ message: 'Invalid book identifier' });
  if (!(await Book.exists({ _id: requestedBookId }))) return res.status(404).json({ message: 'Book not found' });
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: 'Account not found' });
  const bookId = new mongoose.Types.ObjectId(requestedBookId);
  const isSaved = user.savedBooks.some((id: any) => id.toString() === bookId.toString());
  if (isSaved) user.savedBooks = user.savedBooks.filter((id: any) => id.toString() !== bookId.toString()) as any;
  else user.savedBooks.push(bookId as any);
  await user.save();
  res.json({ saved: !isSaved });
};
