'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'pengajuan_magang'
     */
    await queryInterface.createTable('pengajuan_magang', { // Nama tabel: 'pengajuan_magang' sesuai tableName di model
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
      lowongan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Ini adalah kunci asing ke tabel 'lowongan'
          model: 'lowongan', // Nama tabel yang direferensikan (pastikan sudah ada migrasi untuk tabel 'lowongan')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Atau 'SET NULL', 'RESTRICT', dll., sesuaikan dengan logika bisnis Anda
      },
      tanggal_pengajuan: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('diajukan', 'diterima', 'ditolak', 'selesai'),
        allowNull: false
      }
      // Karena Anda memiliki `timestamps: false` di model PengajuanMagang Anda,
      // maka tidak perlu menambahkan kolom timestamp otomatis seperti `createdAt` atau `updatedAt` di migrasi ini.
    }, {
        // Karena `tableName: 'pengajuan_magang'` sudah didefinisikan di model,
        // dan `timestamps: false` juga sudah didefinisikan,
        // Anda tidak perlu secara eksplisit menambahkannya di bagian options ini untuk `createTable`.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'pengajuan_magang')
     */
    await queryInterface.dropTable('pengajuan_magang');
  }
};