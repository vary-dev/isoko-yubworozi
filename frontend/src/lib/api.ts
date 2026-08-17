import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// GETters
export const fetchBooks = () => api.get('/books');
export const fetchArticles = () => api.get('/articles');
export const fetchVideos = () => api.get('/videos');

// POSTers (Admin)
export const uploadBook = (formData: FormData) => api.post('/books', formData);
export const uploadArticle = (formData: FormData) => api.post('/articles', formData);
export const addVideo = (data: any) => api.post('/videos', data);

export default api;