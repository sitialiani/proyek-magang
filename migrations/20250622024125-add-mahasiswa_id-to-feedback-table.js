'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Perintah untuk menambahkan kolom baru
    await queryInterface.addColumn(
      'feedback', // Nama tabel yang akan diubah
      'mahasiswa_id', // Nama kolom baru yang akan ditambahkan
      {
        type: Sequelize.INTEGER,
        allowNull: true, // Ubah menjadi false jika wajib diisi
        references: {
          model: 'mahasiswa', // Nama tabel yang direferensikan
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // atau 'CASCADE' jika feedback harus ikut terhapus
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Perintah untuk mengembalikan (undo) perubahan
    await queryInterface.removeColumn('feedback', 'mahasiswa_id');
  }
};
