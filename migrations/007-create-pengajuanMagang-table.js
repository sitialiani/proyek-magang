// 007-create-pengajuanMagang-table.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('pengajuan_magang', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mahasiswa',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lowongan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lowongan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tanggal_pengajuan: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      // >>> TAMBAHKAN INI <<<
      komentar_dosen: {
        type: Sequelize.TEXT, // Sesuaikan tipe data (TEXT untuk panjang, STRING(255) jika pendek)
        allowNull: true // Sesuaikan apakah kolom ini boleh null atau tidak
      }
      // Jika ada timestamps seperti createdAt, updatedAt, pastikan mereka juga ada di sini
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('pengajuan_magang');
  }
};