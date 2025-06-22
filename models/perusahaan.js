'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Perusahaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan relasi di sini:
      // Satu Perusahaan bisa memiliki banyak Lowongan
      this.hasMany(models.Lowongan, {
        foreignKey: 'perusahaan_id',
        as: 'lowongans' // Alias untuk memanggil daftar lowongan
      });
    }
  }
  Perusahaan.init({
    nama: {
      type: DataTypes.STRING,
      allowNull: false // Nama perusahaan sebaiknya tidak kosong
    },
    alamat: DataTypes.TEXT,
    email: DataTypes.STRING,
    telepon: DataTypes.STRING,
    pic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Perusahaan',
    tableName: 'perusahaan', // Sesuaikan dengan nama tabel di database Anda
    timestamps: false     // Beritahu Sequelize bahwa tabel ini tidak punya kolom createdAt/updatedAt
  });
  return Perusahaan;
};
