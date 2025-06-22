'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('penilaian', {
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
        references: {
          model: 'mahasiswa',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dosen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dosen',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // --- PENAMBAHAN KOLOM BARU ---
      laporan_id: { // Kunci asing ke tabel 'laporan'
        type: Sequelize.INTEGER,
        allowNull: true, // Bisa null jika penilaian tidak selalu terkait dengan laporan akhir
        references: {
          model: 'laporan', // Nama tabel 'laporan'
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Jika laporan dihapus, penilaian terkait bisa jadi null
      },
      // --- AKHIR PENAMBAHAN ---
      nilai_akhir: {
        type: Sequelize.FLOAT
      },
      komentar: {
        type: Sequelize.TEXT
      },
      tanggal: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('penilaian');
  }
};
