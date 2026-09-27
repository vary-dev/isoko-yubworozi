import crypto from 'crypto';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';
import Purchase from '../models/Purchase';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { createPaymentLink, verifyProviderTransaction } from '../services/flutterwaveService';

const publicPurchase = (purchase: any) => ({
  _id: purchase._id,
  book: purchase.book,
  txRef: purchase.txRef,
  amount: purchase.amount,
  currency: purchase.currency,
  status: purchase.status,
  paymentMethod: purchase.paymentMethod,
  paidAt: purchase.paidAt,
  createdAt: purchase.createdAt,
});

const confirmPurchase = async (purchase: any, transactionId: string | number) => {
  const verified = await verifyProviderTransaction(transactionId);
  const transaction = verified.data;
  if (!transaction) throw new Error('Payment provider returned no transaction');

  const isValid = transaction.status === 'successful'
    && transaction.tx_ref === purchase.txRef
    && transaction.currency === purchase.currency
    && Number(transaction.amount) >= Number(purchase.amount);

  purchase.providerTransactionId = String(transaction.id);
  purchase.providerStatus = transaction.status;
  purchase.providerMessage = verified.message;
  purchase.paymentMethod = transaction.payment_type;
  purchase.status = isValid ? 'successful' : transaction.status === 'cancelled' ? 'cancelled' : 'failed';
  if (isValid && !purchase.paidAt) purchase.paidAt = new Date();
  await purchase.save();
  return purchase;
};

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId } = req.body;
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).json({ message: 'Invalid book identifier' });
    const [book, user] = await Promise.all([Book.findById(bookId), User.findById(req.user!.id)]);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!user) return res.status(401).json({ message: 'Account not found' });
    if (!book.isPremium || Number(book.price) <= 0) return res.status(400).json({ message: 'This book does not require payment' });

    const owned = await Purchase.findOne({ user: user._id, book: book._id, status: 'successful' });
    if (owned) return res.json({ alreadyOwned: true, purchase: publicPurchase(owned) });

    const txRef = `isoko-${book._id}-${crypto.randomUUID()}`;
    const purchase = await Purchase.create({ user: user._id, book: book._id, txRef, amount: book.price, currency: 'RWF' });
    const redirectUrl = process.env.PAYMENT_REDIRECT_URL || `${process.env.CLIENT_URL || 'https://isokoyubworozi.vercel.app'}/payment/callback`;
    const result = await createPaymentLink({
      tx_ref: txRef,
      amount: book.price,
      currency: 'RWF',
      redirect_url: redirectUrl,
      payment_options: 'card,mobilemoneyrwanda',
      customer: { email: user.email, name: user.name },
      customizations: {
        title: `Isoko y'Ubworozi — ${book.title}`,
        description: 'Secure premium book access',
        logo: 'https://res.cloudinary.com/dydg39ukk/image/upload/v1788943683/isoko-yubworozi-logo_ijbygk.png',
      },
      meta: { purchaseId: purchase._id.toString(), userId: user._id.toString(), bookId: book._id.toString() },
    });
    if (!result.data?.link) {
      purchase.status = 'failed';
      purchase.providerMessage = result.message;
      await purchase.save();
      return res.status(502).json({ message: 'The payment provider did not create a checkout link' });
    }
    res.status(201).json({ checkoutUrl: result.data.link, txRef, purchase: publicPurchase(purchase) });
  } catch (error) {
    res.status(502).json({ message: error instanceof Error ? error.message : 'Unable to start payment' });
  }
};

export const verifyCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const transactionId = String(req.query.transaction_id || '');
    const txRef = String(req.query.tx_ref || '');
    if (!transactionId || !txRef) return res.status(400).json({ message: 'Transaction ID and reference are required' });
    const purchase = await Purchase.findOne({ txRef, user: req.user!.id }).populate('book', 'title coverImage');
    if (!purchase) return res.status(404).json({ message: 'Payment record not found for this account' });
    if (purchase.status !== 'successful') await confirmPurchase(purchase, transactionId);
    res.json({ verified: purchase.status === 'successful', purchase: publicPurchase(purchase) });
  } catch (error) {
    res.status(502).json({ message: error instanceof Error ? error.message : 'Unable to verify payment' });
  }
};

export const paymentWebhook = async (req: Request, res: Response) => {
  try {
    if (!process.env.FLW_SECRET_HASH || req.header('verif-hash') !== process.env.FLW_SECRET_HASH) {
      return res.status(401).json({ message: 'Invalid webhook signature' });
    }
    const transactionId = req.body?.data?.id;
    const txRef = req.body?.data?.tx_ref;
    if (!transactionId || !txRef) return res.sendStatus(200);
    const purchase = await Purchase.findOne({ txRef });
    if (purchase && purchase.status !== 'successful') await confirmPurchase(purchase, transactionId);
    res.sendStatus(200);
  } catch (error) {
    console.error('Payment webhook error:', error instanceof Error ? error.message : error);
    res.sendStatus(200);
  }
};

export const myPurchases = async (req: AuthRequest, res: Response) => {
  const purchases = await Purchase.find({ user: req.user!.id }).populate('book', 'title coverImage category').sort({ createdAt: -1 });
  res.json(purchases.map(publicPurchase));
};

export const bookPaymentStatus = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.bookId)) return res.status(400).json({ message: 'Invalid book identifier' });
  const purchase = await Purchase.findOne({ user: req.user!.id, book: req.params.bookId, status: 'successful' });
  res.json({ owned: Boolean(purchase), purchase: purchase ? publicPurchase(purchase) : null });
};
