'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'notifikasi'
     */
    await queryInterface.createTable('notifikasi', { // Nama tabel: 'notifikasi' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Ini adalah kunci asing ke tabel 'users'
          model: 'users', // Nama tabel yang direferensikan (pastikan sudah ada migrasi untuk tabel 'users')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Atau 'SET NULL', 'RESTRICT', dll., sesuaikan dengan logika bisnis Anda
      },
      judul: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      pesan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      dibaca: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      tanggal_kirim: { // Sesuai dengan definisi di model notifikasi.js
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
      // Karena Anda memiliki `timestamps: false` di model Notifikasi Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'notifikasi'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'notifikasi')
     */
    await queryInterface.dropTable('notifikasi');
  }
};