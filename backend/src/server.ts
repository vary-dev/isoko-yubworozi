import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';

// Route Imports
import bookRoutes from './routes/bookRoutes';
import articleRoutes from './routes/articleRoutes';
import authRoutes from './routes/authRoutes';
import statsRoutes from './routes/statsRoutes';
import mediaRoutes from './routes/mediaRoutes';
import youtubeRoutes from './routes/youtubeRoutes';

// Initialization
dotenv.config();
connectDB();

const app = express();

// Middleware
const allowedOrigins = new Set(
  [
    'https://isokoyubworozi.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
  ].filter((origin): origin is string => Boolean(origin)),
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Root Health Check
app.get('/', (_req, res) => {
  res.send('Isoko Yubworozi API is running...');
});

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/youtube', youtubeRoutes);

// Global Error Handler (catches multer/file upload errors)
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Server Error:', err?.message || err);
  if (err?.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  res.status(500).json({ message: 'Server error', error: err?.message || err });
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📂 API available at http://localhost:${PORT}/api`);
});
