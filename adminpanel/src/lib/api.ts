import axios from 'axios';
// Keep browser requests on the admin site's origin. The route handler under
// /api forwards them to the backend without a browser Origin header, avoiding
// backend CORS failures for Netlify deploy previews and custom domains.
export const API_URL = '/api';
const API = axios.create({ baseURL: API_URL, timeout: 20000 });
const UPLOAD_TIMEOUT = 120000;
API.interceptors.request.use((config) => { const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null; if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
API.interceptors.response.use((response) => response, (error) => { if ([401, 403].includes(error.response?.status) && typeof window !== 'undefined') { sessionStorage.removeItem('admin_token'); sessionStorage.removeItem('admin_user'); if (window.location.pathname.startsWith('/admin')) window.location.replace('/login'); } return Promise.reject(error); });
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : fallback;
  const data = error.response?.data as { message?: unknown; details?: unknown; error?: unknown; code?: unknown; field?: unknown; provider?: unknown; providerStatus?: unknown } | undefined;
  const message = typeof data?.message === 'string' ? data.message : '';
  const detail = typeof data?.details === 'string'
    ? data.details
    : typeof data?.error === 'string'
      ? data.error
      : data?.error && typeof data.error === 'object' && 'message' in data.error && typeof data.error.message === 'string'
        ? data.error.message
      : '';
  const metadata = [
    typeof data?.code === 'string' ? data.code : null,
    data?.field ? `field: ${data.field}` : null,
    typeof data?.provider === 'string' ? data.provider : null,
    data?.providerStatus ? `provider status: ${data.providerStatus}` : null,
  ].filter((value): value is string => typeof value === 'string');
  const reason = [message, detail && detail !== message ? detail : '', ...metadata].filter(Boolean).join(' — ');
  return reason || error.message || fallback;
};
export const getBooks = () => API.get('/books/admin/all');
export const uploadBook = (data: FormData) => API.post('/books', data, { timeout: UPLOAD_TIMEOUT });
export const updateBook = (id: string, data: FormData) => API.put(`/books/${id}`, data, { timeout: UPLOAD_TIMEOUT });
export const deleteBook = (id: string) => API.delete(`/books/${id}`);
export const getArticles = () => API.get('/articles');
export const uploadArticle = (data: FormData) => API.post('/articles', data, { timeout: UPLOAD_TIMEOUT });
export const updateArticle = (id: string, data: FormData) => API.put(`/articles/${id}`, data, { timeout: UPLOAD_TIMEOUT });
export const deleteArticle = (id: string) => API.delete(`/articles/${id}`);
export const getYouTubeChannelVideos = (limit = 12) => API.get('/youtube/latest', { params: { limit } });
export const syncYouTubeChannel = (limit = 12) => API.post('/youtube/sync', { limit });
export const getStats = () => API.get('/stats');
export const getRecentActivity = () => API.get('/stats/recent');
export const getMedia = () => API.get('/media');
export const adminLogin = (data: { email: string; password: string }) => API.post('/auth/admin/login', data);
export const registerAdmin = (data: { name: string; email: string; password: string }, setupKey: string) => API.post('/auth/admin/register', data, { headers: { 'x-admin-setup-key': setupKey } });
export const getAdminMe = () => API.get('/auth/admin/me');
export const getPaymentRequests = () => API.get('/payments/admin');
export const issuePaymentPin = (id: string) => API.post(`/payments/admin/${id}/issue-pin`);
export const rejectPaymentRequest = (id: string, reason: string) => API.post(`/payments/admin/${id}/reject`, { reason });
export const getProducts = () => API.get('/products');
export const createProduct = (data: FormData) => API.post('/products', data, { timeout: UPLOAD_TIMEOUT });
export const updateProduct = (id: string, data: FormData) => API.put(`/products/${id}`, data, { timeout: UPLOAD_TIMEOUT });
export const deleteProduct = (id: string) => API.delete(`/products/${id}`);
export default API;
