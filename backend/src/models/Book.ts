import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Poultry, Livestock, etc.
  price: { type: Number, default: 0 },         // 0 means free
  coverImage: { type: String, required: true }, // Cloudinary URL
  fileUrl: { type: String, required: true },    // Cloudinary URL (PDF)
  isPremium: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);