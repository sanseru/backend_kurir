const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log directory from environment variable
const logDir = process.env.LOG_DIR || 'logs';

// Define log format based on environment
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' 
        ? process.env.PROD_LOG_LEVEL 
        : process.env.LOG_LEVEL || 'debug',
    format: logFormat,
    transports: [
        // Error logs
        new DailyRotateFile({
            filename: path.join(logDir, process.env.ERROR_FILE_NAME || 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: process.env.LOG_MAX_SIZE || '20m',
            maxFiles: process.env.LOG_MAX_FILES || '14d',
            level: 'error',
        }),
        // Combined logs
        new DailyRotateFile({
            filename: path.join(logDir, process.env.LOG_FILE_NAME || 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: process.env.LOG_MAX_SIZE || '20m',
            maxFiles: process.env.LOG_MAX_FILES || '14d',
        }),
    ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production' || process.env.DEV_ENABLE_REQUEST_LOGGING === 'true') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

module.exports = logger;