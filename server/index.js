'use strict';

const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const setupSocket = require('./socket');
const authRoutes = require('./routes/auth.routes');
const marketplaceRoutes = require('./routes/marketplace.routes');
const roommateRoutes = require('./routes/roommate.routes');
const interestRoutes = require('./routes/interest.routes');
const nearbyRoutes = require('./routes/nearby.routes');
const conversationRoutes = require('./routes/conversation.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Load environment variables
dotenv.config();

// Initialize Express app & HTTP Server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Server
const io = setupSocket(server);
app.set('io', io);

// Connect to MongoDB
connectDB();

// Core Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CampusNest API Server is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/roommates', roommateRoutes);
app.use('/api/v1/interests', interestRoutes);
app.use('/api/v1/nearby-pgs', nearbyRoutes);
app.use('/api/v1/conversations', conversationRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
