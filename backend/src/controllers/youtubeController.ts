import { Request, Response } from 'express';
import Video from '../models/Video';
import { getLatestChannelVideos } from '../services/youtubeService';

const legacyYouTubeId = (url: string) => url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,})/)?.[1] || '';

export const latestChannelVideos = async (req: Request, res: Response) => {
  try {
    const result = await getLatestChannelVideos(Number(req.query.limit) || 12);
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600').json(result);
  } catch (error) {
    const fallback = await Video.find().sort({ publishedAt: -1, createdAt: -1 }).limit(Math.min(Number(req.query.limit) || 12, 50));
    if (fallback.length) return res.json({ videos: fallback.map((video) => { const id = video.youtubeId || legacyYouTubeId(video.youtubeUrl); return { id: id || video.id, ...video.toObject(), embedUrl: id ? `https://www.youtube-nocookie.com/embed/${id}` : '' }; }), fallback: true });
    res.status(503).json({ message: error instanceof Error ? error.message : 'YouTube videos are temporarily unavailable' });
  }
};

export const syncChannelVideos = async (req: Request, res: Response) => {
  try {
    const result = await getLatestChannelVideos(Number(req.body.limit) || 12, true);
    await Promise.all(result.videos.map((video) => Video.findOneAndUpdate(
      { youtubeId: video.id },
      { youtubeId: video.id, title: video.title, description: video.description, youtubeUrl: video.youtubeUrl, thumbnail: video.thumbnail, category: 'YouTube', duration: video.duration, viewCount: video.viewCount, likeCount: video.likeCount, commentCount: video.commentCount, publishedAt: video.publishedAt, channelTitle: video.channelTitle },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )));
    res.json({ message: `${result.videos.length} channel videos synchronized`, count: result.videos.length, synchronizedAt: new Date().toISOString() });
  } catch (error) {
    res.status(502).json({ message: error instanceof Error ? error.message : 'YouTube synchronization failed' });
  }
};
