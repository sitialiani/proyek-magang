'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pengajuan_magang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER
      },
      lowongan_id: {
        type: Sequelize.INTEGER
      },
      tanggal_pengajuan: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.ENUM('diajukan', 'diterima', 'ditolak', 'selesai'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pengajuan_magang');
  }
};