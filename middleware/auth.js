// src/middleware/auth.js

const jwt = require('jsonwebtoken');
const { User, Role, Permission, RolePermission } = require('../models');

// Middleware to authenticate users based on JWT token
const authenticate = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by ID from token including roles and permissions
        req.user = await User.findByPk(decoded.id, {
            include: [{
                model: Role,
                include: [{
                    model: Permission
                }]
            }]
        });
        
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

// Middleware to authorize users based on roles or permissions
const authorize = (roleOrPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            
            // Get user roles
            const userRoles = await req.user.getRoles();
            
            // Check if user has the required role
            const hasRole = userRoles.some(role => role.name === roleOrPermission);
            console.log(hasRole);
            if (hasRole) {
                return next();
            }
            
            // If not found by role name, check permissions
            let hasPermission = false;
            
            for (const role of userRoles) {
                const permissions = await role.getPermissions();
                if (permissions.some(permission => permission.name === roleOrPermission)) {
                    hasPermission = true;
                    break;
                }
            }
            
            if (hasPermission) {
                return next();
            }
            
            // User doesn't have the required role or permission
            return res.status(403).json({ 
                message: 'Access denied. Insufficient privileges.' 
            });
            
        } catch (error) {
            return res.status(500).json({ 
                message: 'Authorization error', 
                error: error.message 
            });
        }
    };
};

// Support for multiple roles or permissions
const authorizeMultiple = (rolesOrPermissions = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            
            // Get user roles
            const userRoles = await req.user.getRoles();
            const userRoleNames = userRoles.map(role => role.name);
            
            // Check if user has any of the required roles
            const hasRole = rolesOrPermissions.some(role => userRoleNames.includes(role));
            
            if (hasRole) {
                return next();
            }
            
            // If not found by role, check permissions
            let hasPermission = false;
            
            for (const role of userRoles) {
                const permissions = await role.getPermissions();
                const permissionNames = permissions.map(p => p.name);
                
                if (rolesOrPermissions.some(p => permissionNames.includes(p))) {
                    hasPermission = true;
                    break;
                }
            }
            
            if (hasPermission) {
                return next();
            }
            
            // User doesn't have any of the required roles or permissions
            return res.status(403).json({ 
                message: 'Access denied. Insufficient privileges.' 
            });
            
        } catch (error) {
            return res.status(500).json({ 
                message: 'Authorization error', 
                error: error.message 
            });
        }
    };
};

module.exports = { 
    authenticate,
    authorize,
    authorizeMultiple
};