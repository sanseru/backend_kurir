const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');

const authRoutes = require('./auth');
const roleRoutes = require('./role');

// Rate limiters configuration
const rateLimiters = {
    auth: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit login attempts
        message: 'Too many login attempts, please try again after 15 minutes'
    }),
    roles: rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 50, // Limit role operations
        message: 'Too many role operations, please try again later'
    })
};

// Jika menggunkana .env file untuk konfigurasi rate limit, maka kita bisa menggunakan kode berikut:
// const rateLimiters = {
//     auth: rateLimit({
//         windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000,
//         max: parseInt(process.env.RATE_LIMIT_AUTH_MAX) || 5,
//         message: 'Too many login attempts, please try again later'
//     }),
//     // ...existing code...
// };

// Apply specific rate limiters to routes
router.use('/auth/login', rateLimiters.auth); // Strict limit for login
router.use('/auth/register', rateLimiters.auth); // Strict limit for registration
router.use('/roles', rateLimiters.roles); // Moderate limit for role operations

// Route registration
router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);

module.exports = router;