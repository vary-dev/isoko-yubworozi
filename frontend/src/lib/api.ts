import axios from 'axios';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://isoko-yubworozi.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

// GETters
export const fetchBooks = () => api.get('/books');
export const fetchArticles = () => api.get('/articles');
export const fetchLatestYouTubeVideos = (limit = 12) => api.get('/youtube/latest', { params: { limit } });
export const registerUser = (data: { name: string; email: string; password: string }) => api.post('/auth/register', data);
export const loginUser = (data: { email: string; password: string }) => api.post('/auth/login', data);

// POSTers (Admin)
export const uploadBook = (formData: FormData) => api.post('/books', formData);
export const uploadArticle = (formData: FormData) => api.post('/articles', formData);

export default api;
