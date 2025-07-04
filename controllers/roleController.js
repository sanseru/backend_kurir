// src/controllers/roleController.js

const { Role, Permission } = require('../models');

// Function to create a new role
exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;
        const role = await Role.create({ name });
        return res.status(201).json(role);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating role', error });
    }
};

// Function to get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        return res.status(200).json(roles);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching roles', error });
    }
};

// Function to get a role by ID
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        return res.status(200).json(role);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching role', error });
    }
};

// Function to update a role
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        role.name = name;
        await role.save();
        return res.status(200).json(role);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating role', error });
    }
};

// Function to delete a role
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        await role.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting role', error });
    }
};

// Function to assign permissions to a role
exports.assignPermissions = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        const permissions = await Permission.findAll({ where: { id: permissionIds } });
        await role.setPermissions(permissions);
        return res.status(200).json({ message: 'Permissions assigned successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error assigning permissions', error });
    }
};