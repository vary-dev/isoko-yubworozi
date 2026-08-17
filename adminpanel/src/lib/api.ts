import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally (redirect to login)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ BOOKS ============
export const getBooks = () => API.get('/books');
export const getBookById = (id: string) => API.get(`/books/${id}`);
export const uploadBook = (formData: FormData) => API.post('/books', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateBook = (id: string, formData: FormData) => API.put(`/books/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteBook = (id: string) => API.delete(`/books/${id}`);

// ============ ARTICLES ============
export const getArticles = () => API.get('/articles');
export const getArticleById = (id: string) => API.get(`/articles/${id}`);
export const uploadArticle = (formData: FormData) => API.post('/articles', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateArticle = (id: string, formData: FormData) => API.put(`/articles/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteArticle = (id: string) => API.delete(`/articles/${id}`);

// ============ VIDEOS ============
export const getVideos = () => API.get('/videos');
export const getVideoById = (id: string) => API.get(`/videos/${id}`);
export const uploadVideo = (data: { title: string; youtubeUrl: string; category: string }) => API.post('/videos', data);
export const updateVideo = (id: string, data: { title: string; youtubeUrl: string; category: string }) => API.put(`/videos/${id}`, data);
export const deleteVideo = (id: string) => API.delete(`/videos/${id}`);

// ============ STATS ============
export const getStats = () => API.get('/stats');
export const getRecentActivity = () => API.get('/stats/recent');

// ============ AUTH ============
export const login = (credentials: { email: string; password: string }) => API.post('/auth/login', credentials);
export const register = (data: { name: string; email: string; password: string; role?: string }) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

export default API;
