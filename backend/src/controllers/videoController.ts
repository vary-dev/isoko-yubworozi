import { Request, Response } from 'express';
import Video from '../models/Video';

const getYouTubeId = (value: string) => {
  try {
    const url = new URL(value);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0];
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      const match = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
      return match?.[1] || null;
    }
  } catch { return null; }
  return null;
};

export const addVideo = async (req: Request, res: Response) => {
  try {
    const { title, youtubeUrl, category } = req.body;
    if (!title?.trim() || !category?.trim()) return res.status(400).json({ message: 'Title and category are required' });
    const videoId = getYouTubeId(youtubeUrl);
    if (!videoId) return res.status(400).json({ message: 'Enter a valid YouTube video URL' });
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const newVideo = new Video({ title, youtubeUrl, thumbnail, category });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video' });
  }
};

export const getVideos = async (_req: Request, res: Response) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos' });
  }
};

export const getVideoById = async (req: Request, res: Response) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching video', error });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { title, youtubeUrl, category } = req.body;
    const updateData: Record<string, any> = { title, category };

    // If the YouTube URL changed, re-extract thumbnail
    if (youtubeUrl) {
      updateData.youtubeUrl = youtubeUrl;
      const videoId = getYouTubeId(youtubeUrl);
      if (!videoId) return res.status(400).json({ message: 'Enter a valid YouTube video URL' });
      updateData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const video = await Video.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error updating video', error });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error });
  }
};
