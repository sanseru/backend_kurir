const logger = require('./logger');

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Log error with context
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.id,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    const response = {
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
            ? 'An unexpected error occurred' 
            : err.message,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};