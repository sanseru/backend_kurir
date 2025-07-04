'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Dapatkan ID user admin dan basic
    const [users] = await queryInterface.sequelize.query(
      `SELECT id, email FROM Users WHERE email IN ('admin@admin.com');`
    );

    // Dapatkan ID roles
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM Roles;`
    );

    // Map user email ke id
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user.id;
    });

    // Map role name ke id
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role.id;
    });

    // Debug info
    console.log('Available Users:', Object.keys(userMap));
    console.log('Available Roles:', Object.keys(roleMap));

    // Array untuk user-role assignments
    const userRoles = [];

    // Assign admin role ke admin user
    if (userMap['admin@example.com'] && roleMap.Admin) {
      userRoles.push({
        userId: userMap['admin@admin.com'],
        roleId: roleMap.Admin,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }


    // Bulk insert user-role assignments (jika ada)
    if (userRoles.length > 0) {
      await queryInterface.bulkInsert('UserRoles', userRoles);
      console.log(`Added ${userRoles.length} user-role assignments`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserRoles', null, {});
  }
};