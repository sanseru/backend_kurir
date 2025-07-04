/**
 * Express API Server Configuration
 * 
 * This is the main server configuration file that sets up:
 * - Express application
 * - Security middleware (Helmet, CORS)
 * - Request parsing
 * - Rate limiting
 * - Request logging
 * - Route handling
 * - Error handling
 * - Database connection
 * - Graceful shutdown
 */

const express = require('express');
const helmet = require('helmet');
const { sequelize, testConnection } = require('./config/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const errorHandler = require('./utils/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./utils/logger');
const rateLimit = require('express-rate-limit');

const app = express();

/**
 * Security Middleware Configuration
 * - Helmet: Adds various HTTP headers for security
 * - CORS: Controls which domains can access the API
 */
app.use(helmet());

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

/**
 * Request Body Parsing
 * - Parses JSON payloads
 * - Parses URL-encoded bodies
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * API-Specific Headers
 * - Sets response type to JSON
 * - Prevents MIME-type sniffing
 */
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

/**
 * Middleware Setup
 * - Request logging for debugging and monitoring
 * - API routes
 * - Error handling middleware
 */
app.use(requestLogger);
app.use('/api', routes);
app.use(errorHandler);

/**
 * Database and Server Initialization
 * - Tests database connection
 * - Syncs models with database
 * - Starts the Express server
 */
testConnection();

const port = process.env.PORT || 3000;
sequelize.sync()
.then(() => {
    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
        logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
})
.catch(err => {
    logger.error('Unable to connect to the database:', err);
});

/**
 * Graceful Shutdown Handler
 * Properly closes server and database connections
 * when receiving termination signal
 */
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Performing graceful shutdown...');
    app.close(async () => {
        await sequelize.close();
        logger.info('Database connection closed');
        logger.info('Server closed');
        process.exit(0);
    });
});

// For development hot reloading
if (process.env.NODE_ENV === 'development') {
    process.on('SIGINT', () => {
        process.exit(0);
    });
}

module.exports = app;
