'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk membuat tabel 'lowongan'
     */
    await queryInterface.createTable('lowongan', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      perusahaan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'perusahaan',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      judul: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      kualifikasi: {
        type: Sequelize.TEXT
      },
      tanggal_dibuka: {
        type: Sequelize.DATE
      },
      tanggal_ditutup: {
        type: Sequelize.DATE
      },
      link_berkas: {
        type: Sequelize.STRING(2500)
      },
      lokasi: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      durasi: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      deadlinependaftaran: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus tabel 'lowongan')
     */
    await queryInterface.dropTable('lowongan');
  }
};