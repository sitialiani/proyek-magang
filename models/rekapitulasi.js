'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rekapitulasi extends Model {
    static associate(models) {
      // Rekapitulasi untuk mahasiswa
      this.belongsTo(models.Mahasiswa, {
        foreignKey: 'mahasiswa_id',
        as: 'mahasiswa'
      });
    }
  }
  
  Rekapitulasi.init({
    mahasiswa_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nilai_akhir: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    status_laporan: {
      type: DataTypes.ENUM('selesai', 'belum selesai'),
      allowNull: false,
      defaultValue: 'belum selesai'
    },
    tanggal_rekap: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Rekapitulasi',
    tableName: 'rekapitulasi',
    timestamps: true
  });
  return Rekapitulasi;
}; 