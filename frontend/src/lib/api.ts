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
export const updateUserProfile = (data: FormData) => api.put('/auth/profile', data);
export const fetchMyPurchases = () => api.get('/payments/me');
export const createManualBookPayment = (data: { bookId: string; paymentMethod: 'mtn' | 'airtel'; payerPhone: string }) => api.post('/payments/request', data);
export const markBookPaymentSent = (purchaseId: string, data: { payerPhone: string; amount: number }) => api.post(`/payments/${purchaseId}/mark-paid`, data);
export const verifyBookPaymentPin = (purchaseId: string, pin: string) => api.post('/payments/verify-pin', { purchaseId, pin });
export const fetchBookPaymentStatus = (bookId: string) => api.get(`/payments/book/${encodeURIComponent(bookId)}/status`);
export const fetchBookAccess = (bookId: string) => api.get(`/books/${encodeURIComponent(bookId)}/access`);
export const fetchSavedBooks = () => api.get('/books/saved/me');
export const toggleSavedBook = (bookId: string) => api.post(`/books/${encodeURIComponent(bookId)}/save`);
export const fetchProducts = (params?: { category?: string; featured?: boolean }) => api.get('/products', { params });
export const fetchProduct = (productId: string) => api.get(`/products/${encodeURIComponent(productId)}`);
export const fetchSavedProducts = () => api.get('/products/saved/me');
export const toggleSavedProduct = (productId: string) => api.post(`/products/${encodeURIComponent(productId)}/save`);
export const fetchCart = () => api.get('/products/cart/me');
export const addProductToCart = (productId: string) => api.post(`/products/${encodeURIComponent(productId)}/cart`);
export const updateCartProduct = (productId: string, quantity: number) => api.patch(`/products/${encodeURIComponent(productId)}/cart`, { quantity });
export const removeCartProduct = (productId: string) => api.delete(`/products/${encodeURIComponent(productId)}/cart`);

// POSTers (Admin)
export const uploadBook = (formData: FormData) => api.post('/books', formData);
export const uploadArticle = (formData: FormData) => api.post('/articles', formData);

export default api;
