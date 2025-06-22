'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lowongan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      perusahaan_id: {
        type: Sequelize.INTEGER
      },
      perusahaan: {
        type: Sequelize.STRING
      },
      lokasi: {
        type: Sequelize.STRING
      },
      durasi: {
        type: Sequelize.STRING
      },
      deadlinependaftaran: {
        type: Sequelize.DATEONLY
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lowongan');
  }
};