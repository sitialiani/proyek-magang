'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dokumen', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pengajuan_id: {
        type: Sequelize.INTEGER
      },
      nama_file: {
        type: Sequelize.STRING
      },
      jenis: {
        type: Sequelize.STRING
      },
      file_path: {
        type: Sequelize.TEXT
      },
      tanggal_upload: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('dokumen');
  }
};