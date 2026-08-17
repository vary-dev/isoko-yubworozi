import { Request, Response } from 'express';
import Video from '../models/Video';

export const addVideo = async (req: Request, res: Response) => {
  try {
    const { title, youtubeUrl, category } = req.body;
    // Simple logic to extract YouTube ID for thumbnail
    const videoId = youtubeUrl.split('v=')[1]?.split('&')[0] || youtubeUrl.split('/').pop();
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const newVideo = new Video({ title, youtubeUrl, thumbnail, category });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video' });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos' });
  }
};