'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'perusahaan'
     */
    await queryInterface.createTable('perusahaan', { // Nama tabel: 'perusahaan' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      alamat: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING(100)
      },
      telepon: {
        type: Sequelize.STRING(20)
      },
      pic: { // Penanggung jawab
        type: Sequelize.STRING(100)
      }
      // Karena Anda memiliki `timestamps: false` di model Perusahaan Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'perusahaan'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'perusahaan')
     */
    await queryInterface.dropTable('perusahaan');
  }
};