'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123', 
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Users', [{
      username: 'siti',
      email: 'siti@gmail.com',
      password: 'siti123', 
      role: 'mahasiswa',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Users', [{
      username: 'dosen',
      email: 'dosen@gmail.com',
      password: 'dosen123', 
      role: 'dosen',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
