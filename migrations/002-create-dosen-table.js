'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'dosen'
     */
    await queryInterface.createTable('dosen', { // Nama tabel: 'dosen' sesuai tableName di model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { // Ini adalah kunci asing ke tabel 'users'
          model: 'users', // Nama tabel yang direferensikan (pastikan Anda sudah membuat migrasi untuk tabel 'users' terlebih dahulu)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Atau 'SET NULL', 'RESTRICT', dll., sesuaikan dengan logika bisnis Anda
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nidn: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      telepon: {
        type: Sequelize.STRING(15)
      }
      // Karena Anda memiliki `timestamps: false` di model Dosen Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'dosen'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'dosen')
     */
    await queryInterface.dropTable('dosen');
  }
};