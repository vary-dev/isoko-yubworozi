import express from 'express';
import { register, login, getMe, registerAdmin, loginAdmin, updateProfile } from '../controllers/authController';
import { protect, adminOnly } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// Separate administrator access. Setup-key registration prevents public privilege escalation.
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/me', protect, adminOnly, getMe);

// @route   GET /api/auth/me (protected)
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadImage.single('avatar'), updateProfile);

export default router;
