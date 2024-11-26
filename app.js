// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const { authenticateJWT, authorize } = require('./middleware/authMiddleware');

// Initialize the app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Route setup with middleware
app.use('/auth', authRoutes);                     // Authentication routes
app.use('/admin', authenticateJWT, adminRoutes);  // Protected admin routes
app.use('/appointments', authenticateJWT, appointmentRoutes); // Protected appointment routes
app.use('/users', authenticateJWT, userRoutes);   // Protected user routes

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Export the app for server configuration
module.exports = app;