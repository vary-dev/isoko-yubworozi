import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // Markdown or HTML
  category: { type: String, required: true },
  image: { type: String, required: true }, // Thumbnail
  author: { type: String, default: 'Isoko Yubworozi' },
}, { timestamps: true });

export default mongoose.model('Article', articleSchema);