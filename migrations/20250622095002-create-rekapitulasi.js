'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rekapitulasi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mahasiswa',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nilai_akhir: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      status_laporan: {
        type: Sequelize.ENUM('selesai', 'belum selesai'),
        allowNull: false,
        defaultValue: 'belum selesai'
      },
      tanggal_rekap: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rekapitulasi');
  }
}; 