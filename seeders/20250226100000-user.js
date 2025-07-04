'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Buat user admin
    await queryInterface.bulkInsert('Users', [{
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@admin.com',
      userName: 'admin',
      password: bcrypt.hashSync('admin123', 10), // Gunakan password yang lebih kuat di produksi
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Dapatkan ID user admin yang baru dibuat
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email = 'admin@admin.com' LIMIT 1;`
    );
    const adminUserId = users[0].id;

    // Dapatkan ID role Admin
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'Admin' LIMIT 1;`
    );
    
    if (roles.length === 0) {
      console.warn("Role 'Admin' not found in database");
      return;
    }
    
    const adminRoleId = roles[0].id;

    // Buat relasi user-role untuk admin
    await queryInterface.bulkInsert('UserRoles', [{
      userId: adminUserId,
      roleId: adminRoleId,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    
    console.log(`Created admin user with ID ${adminUserId} and assigned Admin role ID ${adminRoleId}`);
  },

  async down(queryInterface, Sequelize) {
    // Hapus relasi user-role untuk admin terlebih dahulu
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email = 'admin@admin.com' LIMIT 1;`
    );
    
    if (users.length > 0) {
      const adminUserId = users[0].id;
      await queryInterface.bulkDelete('UserRoles', { userId: adminUserId });
    }
    
    // Hapus user admin
    await queryInterface.bulkDelete('Users', { email: 'admin@admin.com' });
  }
};