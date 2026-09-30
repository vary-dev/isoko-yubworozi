import mongoose from 'mongoose';

const localizedTextSchema = new mongoose.Schema({
  rw: { type: String, required: true, trim: true },
  en: { type: String, trim: true, default: '' },
  fr: { type: String, trim: true, default: '' },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: localizedTextSchema, required: true },
  description: { type: localizedTextSchema, required: true },
  category: { type: String, required: true, trim: true, index: true },
  image: { type: String, required: true },
  hasPrice: { type: Boolean, default: false },
  price: { type: Number, min: 0, default: null },
  inStock: { type: Boolean, default: true, index: true },
  featured: { type: Boolean, default: false, index: true },
}, { timestamps: true });

productSchema.index({ 'name.rw': 'text', 'name.en': 'text', 'name.fr': 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
