'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'users'
     */
    await queryInterface.createTable('users', { // Nama tabel: 'users' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('mahasiswa', 'dosen', 'admin'),
        allowNull: false
      },
      created_at: { // Sesuai dengan definisi di model user.js
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      // Karena Anda memiliki `timestamps: false` di model User Anda,
      // dan tidak ada kolom `updated_at` yang didefinisikan secara eksplisit di model,
      // maka tidak perlu menambahkannya di migrasi ini.
    }, {
        // Karena `tableName: 'users'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'users')
     */
    await queryInterface.dropTable('users');
  }
};