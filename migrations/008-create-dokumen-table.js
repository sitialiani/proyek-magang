// <timestamp>-create-dokumen.js (jika Anda membuat ulang tabel dokumen)
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('dokumen', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      pengajuan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pengajuan_magang', // Nama tabel yang direferensikan
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nama_file: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      jenis: { // <<< PASTIKAN INI ADA DENGAN TIPE ENUM YANG BENAR <<<
        type: Sequelize.ENUM('CV', 'transkrip', 'surat', 'proposal', 'lainnya'),
        allowNull: false
      },
      file_path: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tanggal_upload: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('dokumen');
  }
};