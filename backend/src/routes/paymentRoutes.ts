import express from 'express';
import { adminPayments, bookPaymentStatus, createManualPayment, issuePaymentPin, markPaymentSent, myPurchases, rejectPayment, verifyManualPin } from '../controllers/paymentController';
import { adminOnly, protect } from '../middleware/auth';

const router = express.Router();

router.post('/request', protect, createManualPayment);
router.post('/:id/mark-paid', protect, markPaymentSent);
router.post('/verify-pin', protect, verifyManualPin);
router.get('/me', protect, myPurchases);
router.get('/book/:bookId/status', protect, bookPaymentStatus);
router.get('/admin', protect, adminOnly, adminPayments);
router.post('/admin/:id/issue-pin', protect, adminOnly, issuePaymentPin);
router.post('/admin/:id/reject', protect, adminOnly, rejectPayment);

export default router;
