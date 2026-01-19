import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import newsRoutes from './routes/news.js';

console.log('Route imports:', {
  authRoutes: typeof authRoutes,
  userRoutes: typeof userRoutes,
  newsRoutes: typeof newsRoutes
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

console.log('CORS Options:', corsOptions);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/royalgambit';
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\n⚠️  Please check:');
    console.error('1. Is MongoDB running? (for local MongoDB)');
    console.error('   - Windows: Check Services or run "mongod"');
    console.error('   - Or use MongoDB Atlas (cloud)');
    console.error('2. Check your MONGODB_URI in server/.env file');
    console.error('3. For MongoDB Atlas, make sure your IP is whitelisted');
    console.error('4. Current MONGODB_URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/royalgambit (default)');
    console.error('\n⚠️  Server will start but database operations will fail!\n');
    // Don't exit - let server start but operations will fail gracefully
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// Routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
console.log('Routes registered successfully');

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working', timestamp: new Date().toISOString() });
});

// Direct auth test route
app.post('/api/auth/test-login', (req, res) => {
  res.json({ message: 'Direct auth route working', body: req.body });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
