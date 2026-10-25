import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  youtubeId: { type: String, unique: true, sparse: true, index: true },
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  thumbnail: { type: String },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: String, default: '' },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  publishedAt: { type: Date },
  channelTitle: { type: String, default: "Isoko y'Ubworozi" },
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);
