import axios from 'axios';
import { getSession } from './session';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://isoko-yubworozi.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getSession()?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// GETters
export const fetchBooks = () => api.get('/books');
export const fetchArticles = () => api.get('/articles');
export type VideoSort = 'latest' | 'popular' | 'old';
export const fetchLatestYouTubeVideos = (limit = 12, sort: VideoSort = 'latest') => api.get('/youtube/latest', { params: { limit, sort } });
export const registerUser = (data: { name: string; email: string; password: string }) => api.post('/auth/register', data);
export const loginUser = (data: { email: string; password: string }) => api.post('/auth/login', data);
export const fetchMyPurchases = () => api.get('/payments/me');
export const createManualBookPayment = (data: { bookId: string; paymentMethod: 'mtn' | 'airtel'; payerPhone: string }) => api.post('/payments/request', data);
export const verifyBookPaymentPin = (purchaseId: string, pin: string) => api.post('/payments/verify-pin', { purchaseId, pin });
export const fetchBookPaymentStatus = (bookId: string) => api.get(`/payments/book/${encodeURIComponent(bookId)}/status`);
export const fetchBookAccess = (bookId: string) => api.get(`/books/${encodeURIComponent(bookId)}/access`);

// POSTers (Admin)
export const uploadBook = (formData: FormData) => api.post('/books', formData);
export const uploadArticle = (formData: FormData) => api.post('/articles', formData);

export default api;
