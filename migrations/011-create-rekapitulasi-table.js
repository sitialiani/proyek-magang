'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'rekapitulasi'
     */
    await queryInterface.createTable('rekapitulasi', { // Nama tabel: 'rekapitulasi' sesuai tableName di model
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
      nilai_akhir: {
        type: Sequelize.FLOAT
      },
      status_laporan: {
        type: Sequelize.ENUM('selesai', 'revisi', 'belum'),
        allowNull: false
      },
      tanggal_rekap: { // Sesuai dengan definisi di model rekapitulasi.js
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
      // Karena Anda memiliki `timestamps: false` di model Rekapitulasi Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'rekapitulasi'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'rekapitulasi')
     */
    await queryInterface.dropTable('rekapitulasi');
  }
};