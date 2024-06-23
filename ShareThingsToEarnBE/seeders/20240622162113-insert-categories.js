'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { id: 1, name: 'Electronics and Gadgets', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Home Appliances', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Furniture and Home Decor', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Tools and Equipment', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Recreational and Sports Equipment', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Party and Event Supplies', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Baby and Kids Items', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'Books and Media', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'Musical Instruments', createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'Vehicles', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
