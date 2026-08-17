import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  thumbnail: { type: String },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);