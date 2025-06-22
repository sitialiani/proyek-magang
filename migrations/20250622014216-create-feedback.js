'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dosen_id: {
        type: Sequelize.INTEGER
      },
      laporan_id: {
        type: Sequelize.INTEGER
      },
      pesan: {
        type: Sequelize.TEXT
      },
      tanggal: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('feedback');
  }
};