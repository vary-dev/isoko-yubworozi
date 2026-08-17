import { Request, Response } from 'express';
import Article from '../models/Article';

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, category, author } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const image = req.file ? req.file.path : ''; // From Cloudinary

    const newArticle = new Article({ title, slug, content, category, image, author });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles' });
  }
};