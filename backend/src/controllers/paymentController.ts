import crypto from 'crypto';
import { Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';
import Purchase from '../models/Purchase';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const PAYMENT_NUMBER = process.env.MANUAL_PAYMENT_NUMBER || '0723777623';
const PIN_LIFETIME_MS = 15 * 60 * 1000;
const MAX_PIN_ATTEMPTS = 5;
const phonePattern = /^(?:\+?250|0)?7[2389]\d{7}$/;
const hashPin = (pin: string) => crypto.createHmac('sha256', process.env.JWT_SECRET || 'isoko-payment-pin').update(pin).digest('hex');

const publicPurchase = (purchase: any) => ({
  _id: purchase._id,
  user: purchase.user,
  book: purchase.book,
  txRef: purchase.txRef,
  amount: purchase.amount,
  currency: purchase.currency,
  status: purchase.status,
  paymentMethod: purchase.paymentMethod,
  payerPhone: purchase.payerPhone,
  verificationCodeExpiresAt: purchase.verificationCodeExpiresAt,
  verificationAttempts: purchase.verificationAttempts,
  paidAt: purchase.paidAt,
  approvedAt: purchase.approvedAt,
  rejectedReason: purchase.rejectedReason,
  createdAt: purchase.createdAt,
});

const expireIfNeeded = async (purchase: any) => {
  if (purchase.status === 'pin_issued' && purchase.verificationCodeExpiresAt && purchase.verificationCodeExpiresAt.getTime() <= Date.now()) {
    purchase.status = 'expired';
    purchase.verificationCodeHash = undefined;
    await purchase.save();
  }
  return purchase;
};

export const createManualPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, paymentMethod, payerPhone } = req.body;
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).json({ code: 'INVALID_BOOK', message: 'Invalid book identifier' });
    if (!['mtn', 'airtel'].includes(paymentMethod)) return res.status(400).json({ code: 'INVALID_METHOD', message: 'Choose MTN MoMo or Airtel Money' });
    if (!phonePattern.test(String(payerPhone || '').replace(/\s/g, ''))) return res.status(400).json({ code: 'INVALID_PHONE', message: 'Enter a valid Rwanda mobile number, for example 078… or 073…' });

    const [book, user] = await Promise.all([Book.findById(bookId), User.findById(req.user!.id)]);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!user) return res.status(401).json({ message: 'Account not found' });
    if (!book.isPremium || Number(book.price) <= 0) return res.status(400).json({ message: 'This book does not require payment' });

    const owned = await Purchase.findOne({ user: user._id, book: book._id, status: 'successful' });
    if (owned) return res.json({ alreadyOwned: true, purchase: publicPurchase(owned) });

    const existing = await Purchase.findOne({ user: user._id, book: book._id, status: { $in: ['pending', 'pin_issued'] } }).sort({ createdAt: -1 });
    if (existing) {
      await expireIfNeeded(existing);
      if (['pending', 'pin_issued'].includes(existing.status)) return res.json({ purchase: publicPurchase(existing), paymentNumber: PAYMENT_NUMBER });
    }

    const txRef = 'IYU-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const purchase = await Purchase.create({
      user: user._id,
      book: book._id,
      provider: 'manual-mobile-money',
      txRef,
      amount: book.price,
      currency: 'RWF',
      paymentMethod,
      payerPhone: String(payerPhone).replace(/\s/g, ''),
    });
    res.status(201).json({ purchase: publicPurchase(purchase), paymentNumber: PAYMENT_NUMBER });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unable to create the payment request' });
  }
};

export const verifyManualPin = async (req: AuthRequest, res: Response) => {
  try {
    const { purchaseId, pin } = req.body;
    if (!mongoose.isValidObjectId(purchaseId) || !/^\d{6}$/.test(String(pin || ''))) return res.status(400).json({ code: 'INVALID_PIN_FORMAT', message: 'Enter the six-digit access PIN' });
    const purchase = await Purchase.findOne({ _id: purchaseId, user: req.user!.id }).select('+verificationCodeHash').populate('book', 'title coverImage category');
    if (!purchase) return res.status(404).json({ message: 'Payment request not found' });
    await expireIfNeeded(purchase);
    if (purchase.status === 'successful') return res.json({ verified: true, purchase: publicPurchase(purchase) });
    if (purchase.status === 'expired') return res.status(410).json({ code: 'PIN_EXPIRED', message: 'This access PIN expired. Ask the administrator to issue a new one.' });
    if (purchase.status !== 'pin_issued' || !purchase.verificationCodeHash) return res.status(409).json({ code: 'PAYMENT_PENDING', message: 'The administrator has not issued an access PIN yet.' });

    const valid = crypto.timingSafeEqual(Buffer.from(hashPin(String(pin))), Buffer.from(purchase.verificationCodeHash));
    if (!valid) {
      purchase.verificationAttempts += 1;
      if (purchase.verificationAttempts >= MAX_PIN_ATTEMPTS) {
        purchase.status = 'expired';
        purchase.verificationCodeHash = undefined;
      }
      await purchase.save();
      return res.status(400).json({ code: 'INVALID_PIN', message: purchase.status === 'expired' ? 'Too many attempts. Ask the administrator for a new PIN.' : 'Incorrect PIN. ' + (MAX_PIN_ATTEMPTS - purchase.verificationAttempts) + ' attempts remain.' });
    }

    purchase.status = 'successful';
    purchase.paidAt = new Date();
    purchase.verificationCodeHash = undefined;
    purchase.verificationCodeExpiresAt = undefined;
    await purchase.save();
    res.json({ verified: true, purchase: publicPurchase(purchase) });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unable to verify the access PIN' });
  }
};

export const myPurchases = async (req: AuthRequest, res: Response) => {
  const purchases = await Purchase.find({ user: req.user!.id }).populate('book', 'title coverImage category').sort({ createdAt: -1 });
  await Promise.all(purchases.map(expireIfNeeded));
  res.json(purchases.map(publicPurchase));
};

export const bookPaymentStatus = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.bookId)) return res.status(400).json({ message: 'Invalid book identifier' });
  const purchase = await Purchase.findOne({ user: req.user!.id, book: req.params.bookId, status: { $in: ['successful', 'pin_issued', 'pending'] } }).sort({ createdAt: -1 });
  if (purchase) await expireIfNeeded(purchase);
  res.json({ owned: purchase?.status === 'successful', purchase: purchase ? publicPurchase(purchase) : null, paymentNumber: PAYMENT_NUMBER });
};

export const adminPayments = async (_req: AuthRequest, res: Response) => {
  const purchases = await Purchase.find({ provider: 'manual-mobile-money' })
    .populate('user', 'name email')
    .populate('book', 'title coverImage category')
    .sort({ createdAt: -1 })
    .limit(200);
  await Promise.all(purchases.map(expireIfNeeded));
  res.json(purchases.map(publicPurchase));
};

export const issuePaymentPin = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid payment request' });
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) return res.status(404).json({ message: 'Payment request not found' });
  if (!['pending', 'pin_issued', 'expired'].includes(purchase.status)) return res.status(409).json({ message: 'This payment request cannot receive a new PIN' });

  const pin = String(crypto.randomInt(100000, 1000000));
  purchase.status = 'pin_issued';
  purchase.verificationCodeHash = hashPin(pin);
  purchase.verificationCodeExpiresAt = new Date(Date.now() + PIN_LIFETIME_MS);
  purchase.verificationAttempts = 0;
  purchase.approvedBy = new mongoose.Types.ObjectId(req.user!.id);
  purchase.approvedAt = new Date();
  purchase.rejectedReason = undefined;
  await purchase.save();
  res.json({ message: 'One-time access PIN generated', pin, expiresAt: purchase.verificationCodeExpiresAt, purchase: publicPurchase(purchase) });
};

export const rejectPayment = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid payment request' });
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) return res.status(404).json({ message: 'Payment request not found' });
  if (purchase.status === 'successful') return res.status(409).json({ message: 'Completed access cannot be rejected here' });
  purchase.status = 'rejected';
  purchase.rejectedReason = String(req.body.reason || 'Payment could not be confirmed').slice(0, 240);
  purchase.verificationCodeHash = undefined;
  purchase.verificationCodeExpiresAt = undefined;
  await purchase.save();
  res.json({ purchase: publicPurchase(purchase) });
};
