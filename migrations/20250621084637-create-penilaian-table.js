'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'penilaian'
     */
    await queryInterface.createTable('penilaian', { // Nama tabel: 'penilaian' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Karena ini adalah relasi One-to-One antara Mahasiswa dan Penilaian
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
      nilai_akhir: {
        type: Sequelize.FLOAT
      },
      komentar: {
        type: Sequelize.TEXT
      },
      tanggal: { // Sesuai dengan definisi di model penilaian.js
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
      // Karena Anda memiliki `timestamps: false` di model Penilaian Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'penilaian'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'penilaian')
     */
    await queryInterface.dropTable('penilaian');
  }
};