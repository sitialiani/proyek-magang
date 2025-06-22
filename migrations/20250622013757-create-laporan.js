'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('laporan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER
      },
      judul: {
        type: Sequelize.STRING
      },
      file_path: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('belum dikumpulkan', 'menunggu', 'revisi', 'diterima'),
      },
      tanggal_upload: {
        type: Sequelize.DATE
      },
      versi: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('laporan');
  }
};