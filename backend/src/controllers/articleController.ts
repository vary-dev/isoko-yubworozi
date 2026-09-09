import { Request, Response } from 'express';
import Article from '../models/Article';

const isHttpsUrl = (value: unknown) => {
  try { return new URL(String(value)).protocol === 'https:'; } catch { return false; }
};

const makeSlug = (title: string) => title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, category, author, imageUrl } = req.body;
    if (!title?.trim() || !content?.trim()) return res.status(400).json({ message: 'Title and content are required' });
    const slug = makeSlug(title);
    const image = req.file?.path || (isHttpsUrl(imageUrl) ? imageUrl : '');
    if (!image) return res.status(400).json({ message: 'Upload an image or select one from the media library' });

    const newArticle = new Article({ title, slug, content, category, image, author });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error });
  }
};

export const getArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles' });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, category, author, imageUrl } = req.body;
    const updateData: Record<string, any> = { content, category, author };

    if (title) {
      updateData.title = title;
      updateData.slug = makeSlug(title);
    }

    // If a new image was uploaded, update it
    if (req.file) {
      updateData.image = req.file.path;
    } else if (imageUrl) {
      if (!isHttpsUrl(imageUrl)) return res.status(400).json({ message: 'Media URL must use HTTPS' });
      updateData.image = imageUrl;
    }

    const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article', error });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error });
  }
};
