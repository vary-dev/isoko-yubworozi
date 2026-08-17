import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your Express Backend URL
});

export const fetchBooks = () => api.get('/books');
export const fetchArticles = () => api.get('/articles');
export const fetchVideos = () => api.get('/videos');

export default api;