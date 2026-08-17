import { Request, Response } from 'express';
import Book from '../models/Book';

/**
 * @desc    Create a new book (Admin Only)
 * @route   POST /api/books
 */
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, isPremium } = req.body;
    
    // Explicitly type the files object for TypeScript
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Extract paths from the uploaded files provided by Multer/Cloudinary
    const coverImagePath = files?.['coverImage']?.[0]?.path || '';
    const fileUrlPath = files?.['fileUrl']?.[0]?.path || '';

    if (!coverImagePath || !fileUrlPath) {
       return res.status(400).json({ message: 'Both cover image and PDF file are required' });
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
export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
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
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
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
    const { title, description, category, price, isPremium } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const updateData: Record<string, any> = {
      title,
      description,
      category,
      price: Number(price) || 0,
      isPremium: isPremium === 'true' || isPremium === true,
    };

    // If new files were uploaded, update their paths
    if (files?.['coverImage']?.[0]?.path) {
      updateData.coverImage = files['coverImage'][0].path;
    }
    if (files?.['fileUrl']?.[0]?.path) {
      updateData.fileUrl = files['fileUrl'][0].path;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error });
  }
};