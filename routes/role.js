// src/routes/role.js

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticate, authorize, authorizeMultiple } = require('../middleware/auth');

// Route to create a new role
router.post('/', authenticate, authorize('admin'), roleController.createRole);

// Route to get all roles
router.get('/', authenticate, authorizeMultiple(['Admin', 'Manager']), roleController.getAllRoles);

// Route to get a specific role by ID
router.get('/:id', authenticate, roleController.getRoleById);

// Route to update a role by ID
router.put('/:id', authenticate, authorize('admin'), roleController.updateRole);

// Route to delete a role by ID
router.delete('/:id', authenticate, authorize('admin'), roleController.deleteRole);

module.exports = router;