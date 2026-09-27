import express from 'express';
import { bookPaymentStatus, createCheckout, myPurchases, paymentWebhook, verifyCheckout } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/webhook', paymentWebhook);
router.post('/checkout', protect, createCheckout);
router.get('/verify', protect, verifyCheckout);
router.get('/me', protect, myPurchases);
router.get('/book/:bookId/status', protect, bookPaymentStatus);

export default router;
