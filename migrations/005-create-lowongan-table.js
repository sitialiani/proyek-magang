'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'lowongan'
     */
    await queryInterface.createTable('lowongan', { // Nama tabel: 'lowongan' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      perusahaan: { // Kolom 'perusahaan' baru, menggantikan 'perusahaan_id'
        type: Sequelize.STRING(150),
        allowNull: false
      },
      lokasi: { // Kolom 'lokasi' baru
        type: Sequelize.STRING(150),
        allowNull: false
      },
      durasi: { // Kolom 'durasi' baru
        type: Sequelize.STRING(150),
        allowNull: false
      },
      deadlinependaftaran: { // Kolom 'deadlinependaftaran' baru, menggantikan 'tanggal_dibuka' dan 'tanggal_ditutup'
        type: Sequelize.DATEONLY
      },
      deskripsi: { // Kolom 'deskripsi' tetap sama
        type: Sequelize.TEXT
      }
      // Karena Anda memiliki `timestamps: false` di model Lowongan Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'lowongan')
     */
    await queryInterface.dropTable('lowongan');
  }
};