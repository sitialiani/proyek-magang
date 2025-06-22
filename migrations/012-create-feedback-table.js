'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'feedback'
     */
    await queryInterface.createTable('feedback', { // Nama tabel: 'feedback' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Ini adalah kunci asing ke tabel 'mahasiswa'
          model: 'mahasiswa', // Nama tabel yang direferensikan (pastikan sudah ada migrasi untuk tabel 'mahasiswa')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Atau 'SET NULL', 'RESTRICT', dll., sesuaikan dengan logika bisnis Anda
      },
      dosen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Ini adalah kunci asing ke tabel 'dosen'
          model: 'dosen', // Nama tabel yang direferensikan (pastikan sudah ada migrasi untuk tabel 'dosen')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Atau 'SET NULL', 'RESTRICT', dll., sesuaikan dengan logika bisnis Anda
      },
      pesan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tanggal: { // Sesuai dengan definisi di model feedback.js
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
      // Karena Anda memiliki `timestamps: false` di model Feedback Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'feedback'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'feedback')
     */
    await queryInterface.dropTable('feedback');
  }
};