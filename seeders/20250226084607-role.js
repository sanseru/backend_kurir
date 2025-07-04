'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Roles', [
      {
        name: 'Admin', // Role name
        createdAt: new Date(), // Timestamp for creation
        updatedAt: new Date() // Timestamp for update
      },
      {
        name: 'Employee', // Role name
        createdAt: new Date(), // Timestamp for creation
        updatedAt: new Date() // Timestamp for update
      },
      {
        name: 'Manager', // Role name
        createdAt: new Date(), // Timestamp for creation
        updatedAt: new Date() // Timestamp for update
      },
      {
        name: 'Kurir', // Role name
        createdAt: new Date(), // Timestamp for creation
        updatedAt: new Date() // Timestamp for update
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
