import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Article from '../models/Article';

const isHttpsUrl = (value: unknown) => {
  try { return new URL(String(value)).protocol === 'https:'; } catch { return false; }
};

const makeSlug = (title: string) => title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, category, author, imageUrl } = req.body;
    if (!title?.trim() || !content?.trim() || !category?.trim()) return res.status(400).json({ message: 'Title, content and category are required' });
    const slug = makeSlug(title);
    if (await Article.exists({ slug })) return res.status(409).json({ message: 'An article with this title already exists' });
    const image = req.file?.path || (isHttpsUrl(imageUrl) ? imageUrl : '');
    if (!image) return res.status(400).json({ message: 'Upload an image or select one from the media library' });

    const newArticle = new Article({ title, slug, content, category, image, author });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch {
    res.status(500).json({ message: 'Error creating article' });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.category === 'string' && req.query.category.trim()) filter.category = req.query.category.trim();
    if (typeof req.query.q === 'string' && req.query.q.trim()) {
      const term = new RegExp(escapeRegExp(req.query.q.trim()), 'i');
      filter.$or = [{ title: term }, { content: term }, { category: term }];
    }
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 100);
    const articles = await Article.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles' });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid article identifier' });
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error });
  }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, category, author, imageUrl } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid article identifier' });
    const updateData: Record<string, unknown> = {};
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (author !== undefined) updateData.author = author;

    if (title) {
      const slug = makeSlug(title);
      if (await Article.exists({ slug, _id: { $ne: req.params.id } })) return res.status(409).json({ message: 'An article with this title already exists' });
      updateData.title = title;
      updateData.slug = slug;
    }

    // If a new image was uploaded, update it
    if (req.file) {
      updateData.image = req.file.path;
    } else if (imageUrl) {
      if (!isHttpsUrl(imageUrl)) return res.status(400).json({ message: 'Media URL must use HTTPS' });
      updateData.image = imageUrl;
    }

    const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article', error });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid article identifier' });
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error });
  }
};
