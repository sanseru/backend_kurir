const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Register a new user
 * 
 * @route POST /api/auth/register
 * @param {object} req.body - Request body
 * @param {string} req.body.firstName - User first name
 * @param {string} req.body.lastName - User last name
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password (will be hashed)
 * 
 * @returns {object} 201 - User object with success message
 * @returns {object} 500 - Server error message
 * 
 * @example
 * // Request
 * POST /api/auth/register
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "user@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * // Success Response (201)
 * {
 *   "message": "User created",
 *   "user": {
 *     "id": 1,
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "user@example.com",
 *     "createdAt": "2025-02-26T..."
 *   }
 * }
 */
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, userName } = req.body;
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, 10),
            userName: userName || null // Opsional, bisa null jika tidak disediakan
        });

        res.status(201).json({
            message: "User created",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        });
    }
}

/**
 * Login user and get authentication token
 * 
 * @route POST /api/auth/login
 * @param {object} req.body - Request body
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * 
 * @returns {object} 200 - Success message with JWT token
 * @returns {object} 401 - Unauthorized error message
 * @returns {object} 500 - Server error message
 * 
 * @example
 * // Request
 * POST /api/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * // Success Response (200)
 * {
 *   "message": "Login success",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * // Error Response (401)
 * {
 *   "message": "Invalid email or password"
 * }
 */

exports.login = async (req, res, next) => {
    try {
        logger.debug('Login attempt', { email: req.body.email });
        
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            logger.warn('Login failed: User not found', { email });
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            logger.warn('Login failed: Invalid password', { userId: user.id });
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        logger.info('User logged in successfully', { userId: user.id });
        
        res.json({
            message: "Login success",
            token
        });
    } catch (error) {
        logger.error('Login error', { 
            error: error.message,
            stack: error.stack
        });
        next(error);
    }
}

/**
 * Logout current user
 * 
 * @route POST /api/auth/logout
 * @param {object} req.headers - Request headers with authorization token
 * 
 * @returns {object} 200 - Success message
 * @returns {object} 401 - Unauthorized error message
 * 
 * @example
 * // Request
 * POST /api/auth/logout
 * Headers: {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * // Success Response (200)
 * {son({
 *   "message": "Logout success"
 * }
 */exports.logout = (req, res) => {
    try {
        // Instruksi untuk klien untuk menghapus token (melalui respons)
        res.json({
            message: "Logout success",
            instructions: "Please remove the token from your local storage or cookies"
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: "Server Error", 
            error: error.message
        });
    }
};

/**
 * Get current user information
 * 
 * @route GET /api/auth/me
 * @param {object} req.user - User object from authentication middleware
 * 
 * @returns {object} 200 - User object with roles and permissions
 * @returns {object} 401 - Unauthorized error message
 * 
 * @example
 * // Request
 * GET /api/auth/me
 * Headers: {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * // Success Response (200)
 * {
 *   "user": {
 *     "id": 1,
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "user@example.com",
 *     "roles": [{
 *       "name": "Admin",
 *       "permissions": [{
 *         "name": "view_employee"
 *       }]
 *     }]
 *   }
 * }
 */
exports.me = async (req, res) => {
    try {
        logger.debug('Fetching user information', { userId: req.user.id });

        const user = await User.findOne({
            where: { id: req.user.id },
            attributes: ['id', 'firstName', 'lastName', 'email', 'userName', 'createdAt'],
            include: [{
                model: Role,
                through: { attributes: [] }, // Excludes junction table data
                include: [{
                    model: Permission,
                    through: { attributes: [] } // Excludes junction table data
                }]
            }]
        });

        if (!user) {
            logger.warn('User not found when fetching profile', { userId: req.user.id });
            return res.status(404).json({
                message: "User not found"
            });
        }

        logger.info('User profile retrieved successfully', { userId: user.id });
        
        res.json({ user });
    } catch (error) {
        logger.error('Error fetching user profile', { 
            error: error.message,
            stack: error.stack,
            userId: req.user?.id
        });
        res.status(500).json({
            message: "Server Error",
            error: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
};