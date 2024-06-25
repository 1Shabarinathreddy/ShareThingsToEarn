'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ItemRequests', 'status', {
      type: Sequelize.ENUM('pending', 'reject', 'approved', 'returned'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ItemRequests', 'status');
    await queryInterface.sequelize.query('DROP TYPE "enum_ItemRequests_status";');
  }
};
