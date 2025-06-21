'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'laporan'
     */
    await queryInterface.createTable('laporan', { // Nama tabel: 'laporan' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Karena ini adalah relasi One-to-One
        references: { // Ini adalah kunci asing ke tabel 'mahasiswa'
          model: 'mahasiswa', // Nama tabel yang direferensikan (pastikan sudah ada migrasi untuk tabel 'mahasiswa')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Atau 'SET NULL', 'RESTRICT', dll., sesuaikan dengan logika bisnis Anda
      },
      judul: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      file_path: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('belum dikumpulkan', 'menunggu', 'revisi', 'diterima'),
        allowNull: false
      },
      tanggal_upload: { // Sesuai dengan definisi di model laporan.js
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
      // Karena Anda memiliki `timestamps: false` di model Laporan Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'laporan'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'laporan')
     */
    await queryInterface.dropTable('laporan');
  }
};