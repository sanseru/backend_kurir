'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Dapatkan ID dari Role dan Permission
    const [roles] = await queryInterface.sequelize.query(
      'SELECT id, name FROM Roles;'
    );
    
    const [permissions] = await queryInterface.sequelize.query(
      'SELECT id, name FROM Permissions;'
    );

    // Map nama ke ID
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role.id;
    });

    const permMap = {};
    permissions.forEach(perm => {
      permMap[perm.name] = perm.id;
    });

    // Debug: Lihat role dan permission yang tersedia
    console.log('Available Roles:', Object.keys(roleMap));
    console.log('Available Permissions:', Object.keys(permMap));

    // Seeding RolePermissions
    const rolePermissions = [];

    // Admin mendapat semua izin
    if (roleMap.Admin) {
      Object.values(permMap).forEach(permId => {
        rolePermissions.push({
          roleId: roleMap.Admin,
          permissionId: permId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    } else {
      console.warn("Role 'Admin' not found in database");
    }

    // Manager mendapat beberapa izin
    if (roleMap.Manager && permMap.view_employee && permMap.edit_employee) {
      rolePermissions.push(
        {
          roleId: roleMap.Manager,
          permissionId: permMap.view_employee,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          roleId: roleMap.Manager,
          permissionId: permMap.edit_employee,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    } else {
      console.warn("Role 'Manager' or required permissions not found");
    }

    // Employee hanya mendapat view
    if (roleMap.Employee && permMap.view_employee) {
      rolePermissions.push({
        roleId: roleMap.Employee,
        permissionId: permMap.view_employee,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      console.warn("Role 'Employee' or 'view_employee' permission not found");
    }

    if (rolePermissions.length > 0) {
      await queryInterface.bulkInsert('RolePermissions', rolePermissions);
      console.log(`Added ${rolePermissions.length} role-permission assignments`);
    } else {
      console.warn("No role-permission assignments created");
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RolePermissions', null, {});
  }
};