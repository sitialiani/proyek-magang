'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'dokumen'
     */
    await queryInterface.createTable('dokumen', { // Nama tabel: 'dokumen' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      pengajuan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Ini adalah kunci asing ke tabel 'pengajuanMagang' (atau 'pengajuan_magang' jika nama tabelnya itu)
          model: 'pengajuan_magang', // Asumsi nama tabel adalah 'pengajuan_magang'. Sesuaikan jika berbeda!
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Atau 'SET NULL', 'RESTRICT', dll., sesuaikan dengan logika bisnis Anda
      },
      nama_file: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      jenis: {
        type: Sequelize.ENUM('CV', 'transkrip', 'surat', 'proposal', 'lainnya'),
        allowNull: false
      },
      file_path: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tanggal_upload: { // Sesuai dengan definisi di model dokumen.js
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
      // Karena Anda memiliki `timestamps: false` di model Dokumen Anda,
      // dan tidak ada kolom `createdAt` atau `updatedAt` manual yang didefinisikan,
      // maka tidak perlu menambahkannya di migrasi ini.
    }, {
        // Karena `tableName: 'dokumen'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'dokumen')
     */
    await queryInterface.dropTable('dokumen');
  }
};