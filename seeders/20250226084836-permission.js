'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Permissions', [
      {
        name: 'view_employee',
        description: 'Permission to view employee details',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'edit_employee',
        description: 'Permission to edit employee details',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'delete_employee',
        description: 'Permission to delete an employee',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'upload_cv',
        description: 'Permission to upload CVs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'upload_photo',
        description: 'Permission to upload employee photos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Permissions', null, {});

  }
};
