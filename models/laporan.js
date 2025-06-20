'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Laporan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan asosiasi Anda di sini
     
    }
  }
  Laporan.init({
    judul: DataTypes.STRING,
    file_path: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('belum dikumpulkan', 'menunggu', 'revisi', 'diterima'),
      allowNull: false, 
      defaultValue: 'belum dikumpulkan'
    },  
    mahasiswa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Mahasiswas', // Nama tabel yang direferensikan (plural)
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // atau SET NULL, tergantung kebutuhan
    }  
  }, {
    sequelize,
    modelName: 'Laporan',
  });
  return Laporan;
};