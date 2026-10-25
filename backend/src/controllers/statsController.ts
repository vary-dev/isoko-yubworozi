import { Request, Response } from 'express';
import Book from '../models/Book';
import Article from '../models/Article';
import Video from '../models/Video';

/**
 * @desc    Get dashboard stats (counts of books, articles, videos)
 * @route   GET /api/stats
 */
export const getStats = async (_req: Request, res: Response) => {
  try {
    const [booksCount, articlesCount, videosCount] = await Promise.all([
      Book.countDocuments(),
      Article.countDocuments(),
      Video.countDocuments(),
    ]);

    res.json({
      books: booksCount,
      articles: articlesCount,
      videos: videosCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};

/**
 * @desc    Get recent activity across all resources
 * @route   GET /api/stats/recent
 */
export const getRecentActivity = async (_req: Request, res: Response) => {
  try {
    const [recentBooks, recentArticles, recentVideos] = await Promise.all([
      Book.find().sort({ createdAt: -1 }).limit(3).select('title createdAt coverImage'),
      Article.find().sort({ createdAt: -1 }).limit(3).select('title createdAt image'),
      Video.find().sort({ createdAt: -1 }).limit(3).select('title createdAt thumbnail'),
    ]);

    // Merge and sort all by createdAt descending
    const activity = [
      ...recentBooks.map((b) => ({
        type: 'book' as const,
        title: b.title,
        image: b.coverImage,
        createdAt: b.createdAt,
      })),
      ...recentArticles.map((a) => ({
        type: 'article' as const,
        title: a.title,
        image: a.image,
        createdAt: a.createdAt,
      })),
      ...recentVideos.map((v) => ({
        type: 'video' as const,
        title: v.title,
        image: v.thumbnail,
        createdAt: v.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activity', error });
  }
};
