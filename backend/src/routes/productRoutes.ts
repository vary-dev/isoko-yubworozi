import express from 'express';
import { adminOnly, protect } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';
import { addToCart, createProduct, deleteProduct, getCart, getProduct, getProducts, getSavedProducts, removeFromCart, toggleSavedProduct, updateCartItem, updateProduct } from '../controllers/productController';

const router = express.Router();
router.get('/', getProducts);
router.get('/saved/me', protect, getSavedProducts);
router.get('/cart/me', protect, getCart);
router.post('/', protect, adminOnly, uploadImage.single('image'), createProduct);
router.post('/:id/save', protect, toggleSavedProduct);
router.post('/:id/cart', protect, addToCart);
router.patch('/:id/cart', protect, updateCartItem);
router.delete('/:id/cart', protect, removeFromCart);
router.put('/:id', protect, adminOnly, uploadImage.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.get('/:id', getProduct);
export default router;
