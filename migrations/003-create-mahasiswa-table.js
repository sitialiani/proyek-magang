'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'mahasiswa'
     */
    await queryInterface.createTable('mahasiswa', { // Nama tabel: 'mahasiswa' sesuai tableName di model
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
      dosen_pembimbing_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Bisa null jika belum ada dosen pembimbing
        references: { // Ini adalah kunci asing ke tabel 'dosen'
          model: 'dosen', // Nama tabel yang direferensikan (pastikan Anda sudah membuat migrasi untuk tabel 'dosen' terlebih dahulu)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Jika dosen dihapus, kolom ini menjadi null
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      npm: { // Sesuai dengan model Anda
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      jurusan: { // Sesuai dengan model Anda
        type: Sequelize.STRING(100),
        allowNull: false
      },
      angkatan: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      no_hp: {
        type: Sequelize.STRING(15)
      }
      // Karena `timestamps: false` ada di model Mahasiswa Anda dan tidak ada kolom `created_at` atau `updated_at`
      // yang didefinisikan secara eksplisit di model Anda, maka tidak perlu menambahkannya di migrasi ini.
    }, {
        // Karena `tableName: 'mahasiswa'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'mahasiswa')
     */
    await queryInterface.dropTable('mahasiswa');
  }
};