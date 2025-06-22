'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logbook', {
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
      tanggal: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      kegiatan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      verifikasi_dosen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      komentar_dosen: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.dropTable('logbook');
  }
};
