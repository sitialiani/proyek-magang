'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'pengumuman'
     */
    await queryInterface.createTable('pengumuman', { // Nama tabel: 'pengumuman' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      admin_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Bisa null jika tidak merujuk ke user admin
        references: { // Ini adalah kunci asing ke tabel 'users'
          model: 'users', // Nama tabel yang direferensikan (pastikan sudah ada migrasi untuk tabel 'users')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Sesuai dengan onDelete di models/index.js Anda
      },
      judul: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      isi: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tanggal: { // Sesuai dengan definisi di model pengumuman.js
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      ditujukan_kepada: {
        type: Sequelize.ENUM('semua', 'mahasiswa', 'dosen'),
        allowNull: false
      }
      // Karena Anda memiliki `timestamps: false` di model Pengumuman Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'pengumuman'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'pengumuman')
     */
    await queryInterface.dropTable('pengumuman');
  }
};