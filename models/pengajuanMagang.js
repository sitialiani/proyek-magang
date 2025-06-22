'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PengajuanMagang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan relasi di sini:
      
      // 1. Sebuah Pengajuan dimiliki oleh satu Mahasiswa
      this.belongsTo(models.Mahasiswa, {
        foreignKey: 'mahasiswa_id',
        as: 'mahasiswa'
      });

      // 2. Sebuah Pengajuan merujuk ke satu Lowongan
      this.belongsTo(models.Lowongan, {
        foreignKey: 'lowongan_id',
        as: 'lowongan'
      });
      
    }
  }
  PengajuanMagang.init({
    mahasiswa_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lowongan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tanggal_pengajuan: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('diajukan', 'diterima', 'ditolak', 'selesai'),
      allowNull: false,
      defaultValue: 'diajukan'
    }
  }, {
    sequelize,
    modelName: 'PengajuanMagang',
    tableName: 'pengajuan_magang', // Sesuaikan dengan nama tabel di database
    timestamps: false // Sesuai dengan ERD Anda
  });
  return PengajuanMagang;
};
