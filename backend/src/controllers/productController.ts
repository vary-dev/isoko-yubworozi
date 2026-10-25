import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const isHttpsUrl = (value: unknown) => {
  try { return new URL(String(value)).protocol === 'https:'; } catch { return false; }
};
const text = (value: unknown) => String(value || '').trim();
const localized = (body: any, prefix: string) => ({
  rw: text(body[`${prefix}Rw`]),
  en: text(body[`${prefix}En`]),
  fr: text(body[`${prefix}Fr`]),
});
type ProductUploadFiles = { images?: Express.Multer.File[]; image?: Express.Multer.File[] };
const uploadFiles = (req: Request) => req.files as ProductUploadFiles | undefined;
const uploadedImages = (req: Request) => uploadFiles(req)?.images?.map((file) => file.path) || [];
const uploadedLegacyImage = (req: Request) => uploadFiles(req)?.image?.[0]?.path;
const parseImageList = (value: unknown): string[] | null => {
  if (typeof value !== 'string') return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || !parsed.every((image) => typeof image === 'string' && isHttpsUrl(image))) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.category === 'string' && req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;
    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 }).limit(200);
    res.json(products);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.error('Unable to load marketplace products:', details);
    res.status(500).json({ message: 'Unable to load marketplace products', details });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product identifier' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const name = localized(req.body, 'name');
    const description = localized(req.body, 'description');
    if (!name.rw || !description.rw || !text(req.body.category)) return res.status(400).json({ message: 'Kinyarwanda name, description and category are required' });
    const retainedImages = req.body.retainedImages === undefined ? [] : parseImageList(req.body.retainedImages);
    if (!retainedImages) return res.status(400).json({ message: 'Product images must be a JSON list of HTTPS image URLs' });
    const legacyImage = uploadedLegacyImage(req);
    if (req.body.imageUrl && !isHttpsUrl(req.body.imageUrl)) return res.status(400).json({ message: 'Image URL must use HTTPS' });
    const images = [...retainedImages, ...(req.body.imageUrl ? [text(req.body.imageUrl)] : []), ...uploadedImages(req), ...(legacyImage ? [legacyImage] : [])];
    if (!images.length) return res.status(400).json({ message: 'Upload at least one product image or select an HTTPS image URL' });
    if (images.length > 10) return res.status(400).json({ message: 'A product can have at most 10 images' });
    const hasPrice = req.body.hasPrice === 'true' || req.body.hasPrice === true;
    const price = hasPrice ? Number(req.body.price) : null;
    if (hasPrice && (!Number.isFinite(price) || Number(price) <= 0)) return res.status(400).json({ message: 'Enter a valid price or turn pricing off' });
    const product = await Product.create({
      name: { rw: name.rw, en: name.en || name.rw, fr: name.fr || name.rw },
      description: { rw: description.rw, en: description.en || description.rw, fr: description.fr || description.rw },
      category: text(req.body.category), image: images[0], images, hasPrice, price,
      inStock: req.body.inStock !== 'false', featured: req.body.featured === 'true' || req.body.featured === true,
    });
    res.status(201).json(product);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.error('Unable to create product:', details);
    res.status(500).json({ message: 'Unable to create product', details });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product identifier' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const name = localized(req.body, 'name');
    const description = localized(req.body, 'description');
    if (name.rw) product.name = { rw: name.rw, en: name.en || name.rw, fr: name.fr || name.rw } as any;
    if (description.rw) product.description = { rw: description.rw, en: description.en || description.rw, fr: description.fr || description.rw } as any;
    if (req.body.category !== undefined) product.category = text(req.body.category);
    const currentImages = product.images?.length ? product.images : [product.image];
    const retainedImages = req.body.retainedImages === undefined ? currentImages : parseImageList(req.body.retainedImages);
    if (!retainedImages) return res.status(400).json({ message: 'Product images must be a JSON list of HTTPS image URLs' });
    if (req.body.imageUrl && !isHttpsUrl(req.body.imageUrl)) return res.status(400).json({ message: 'Image URL must use HTTPS' });
    const legacyImage = uploadedLegacyImage(req);
    let images = [...retainedImages];
    if (req.body.imageUrl && req.body.retainedImages === undefined) images = [text(req.body.imageUrl), ...images.filter((url) => url !== product.image)];
    if (legacyImage) images = [legacyImage, ...images.filter((url) => url !== product.image)];
    images = [...images, ...uploadedImages(req)];
    if (!images.length) return res.status(400).json({ message: 'A product must have at least one image' });
    if (images.length > 10) return res.status(400).json({ message: 'A product can have at most 10 images' });
    const primaryImage = images[0];
    if (!primaryImage) return res.status(400).json({ message: 'A product must have at least one image' });
    product.images = images;
    product.image = primaryImage;
    product.hasPrice = req.body.hasPrice === 'true' || req.body.hasPrice === true;
    product.price = product.hasPrice ? Number(req.body.price) : null as any;
    if (product.hasPrice && (!Number.isFinite(product.price) || Number(product.price) <= 0)) return res.status(400).json({ message: 'Enter a valid price or turn pricing off' });
    product.inStock = req.body.inStock !== 'false';
    product.featured = req.body.featured === 'true' || req.body.featured === true;
    await product.save();
    res.json(product);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.error('Unable to update product:', details);
    res.status(500).json({ message: 'Unable to update product', details });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product identifier' });
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await User.updateMany({}, { $pull: { savedProducts: product._id, cart: { product: product._id } } });
  res.json({ message: 'Product deleted' });
};

export const getSavedProducts = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id).populate('savedProducts');
  if (!user) return res.status(404).json({ message: 'Account not found' });
  res.json(user.savedProducts || []);
};

export const toggleSavedProduct = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product identifier' });
  if (!(await Product.exists({ _id: req.params.id }))) return res.status(404).json({ message: 'Product not found' });
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: 'Account not found' });
  const saved = user.savedProducts.some((id: any) => id.toString() === String(req.params.id));
  if (saved) user.savedProducts = user.savedProducts.filter((id: any) => id.toString() !== String(req.params.id)) as any;
  else user.savedProducts.push(new mongoose.Types.ObjectId(String(req.params.id)) as any);
  await user.save();
  res.json({ saved: !saved });
};

export const getCart = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id).populate('cart.product');
  if (!user) return res.status(404).json({ message: 'Account not found' });
  res.json((user.cart || []).filter((item: any) => item.product));
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product identifier' });
  if (!(await Product.exists({ _id: req.params.id, inStock: true }))) return res.status(404).json({ message: 'This product is unavailable' });
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: 'Account not found' });
  const item = user.cart.find((entry: any) => entry.product.toString() === String(req.params.id));
  if (item) item.quantity = Math.min(item.quantity + 1, 99);
  else user.cart.push({ product: new mongoose.Types.ObjectId(String(req.params.id)), quantity: 1 } as any);
  await user.save();
  res.json({ message: 'Added to cart', count: user.cart.reduce((sum: number, entry: any) => sum + entry.quantity, 0) });
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const quantity = Math.max(1, Math.min(99, Number(req.body.quantity) || 1));
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: 'Account not found' });
  const item = user.cart.find((entry: any) => entry.product.toString() === String(req.params.id));
  if (!item) return res.status(404).json({ message: 'Cart item not found' });
  item.quantity = quantity; await user.save(); res.json({ quantity });
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: 'Account not found' });
  user.cart = user.cart.filter((entry: any) => entry.product.toString() !== String(req.params.id)) as any;
  await user.save(); res.json({ message: 'Removed from cart' });
};
