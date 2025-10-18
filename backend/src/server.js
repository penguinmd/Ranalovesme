require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const db = require('./models/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const daysRoutes = require('./routes/days');
const placesRoutes = require('./routes/places');
const photosRoutes = require('./routes/photos');
const musicRoutes = require('./routes/music');
const activitiesRoutes = require('./routes/activities');

const app = express();

// Initialize database
db.initialize().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/days', daysRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/activities', activitiesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database connection');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing database connection');
  await db.close();
  process.exit(0);
});

const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`API available at http://localhost:${config.port}/api`);
  console.log(`Environment: ${config.nodeEnv}`);
});

module.exports = { app, server };
