/**
 * CampusNest — Express Server Entry Point
 * ─────────────────────────────────────────
 * Responsibilities:
 *  - Bootstrap the Express application
 *  - Register global middleware
 *  - Mount API route groups
 *  - Start the HTTP server
 *
 * Business logic lives in /controllers, /services, /models
 */

'use strict';

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');
require('dotenv').config();

// ── App Initialisation ─────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ── Request Parsing ────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── HTTP Request Logger (dev only) ─────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Static Files ───────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health-Check Route ─────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusNest API is running 🚀',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── API Route Groups (registered as features are built) ─
// app.use('/api/v1/auth',    require('./routes/auth.routes'));
// app.use('/api/v1/users',   require('./routes/user.routes'));
// app.use('/api/v1/housing', require('./routes/housing.routes'));
// app.use('/api/v1/market',  require('./routes/market.routes'));
// app.use('/api/v1/chat',    require('./routes/chat.routes'));

// ── 404 Handler ────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// ── Global Error Handler ───────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.stack || err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Start Server ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  CampusNest server running on http://localhost:${PORT}`);
  console.log(`📋  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔎  Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app; // exported for testing
