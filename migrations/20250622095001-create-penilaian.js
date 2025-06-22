'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('penilaian', {
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
      nilai_akhir: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      komentar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tanggal: {
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
    await queryInterface.dropTable('penilaian');
  }
}; 