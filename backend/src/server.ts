import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';

// Route Imports
import bookRoutes from './routes/bookRoutes';
import articleRoutes from './routes/articleRoutes';
import videoRoutes from './routes/videoRoutes';

// Initialization
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Health Check
app.get('/', (req, res) => {
  res.send('Isoko Yubworozi API is running...');
});

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/videos', videoRoutes);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📂 API available at http://localhost:${PORT}/api`);
});