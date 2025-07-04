const morgan = require('morgan');
const logger = require('../utils/logger');

// Create a custom Morgan format
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('userId', (req) => req.user ? req.user.id : 'anonymous');

const requestLogger = morgan(
    ':remote-addr - :userId [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms - :body',
    {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
        skip: (req) => {
            // Don't log health check endpoints
            return req.url === '/health' || req.url === '/ping';
        },
    }
);

module.exports = requestLogger;