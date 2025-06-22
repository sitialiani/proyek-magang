'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Logika untuk menambahkan kolom 'lampiran' ke tabel 'pengumuman'
     */
    await queryInterface.addColumn('pengumuman', 'lampiran', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Path file lampiran pengumuman'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Logika untuk mengembalikan perubahan (menghapus kolom 'lampiran')
     */
    await queryInterface.removeColumn('pengumuman', 'lampiran');
  }
}; 