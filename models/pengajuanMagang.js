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
// src/models/PengajuanMagang.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const PengajuanMagang = sequelize.define('PengajuanMagang', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lowongan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal_pengajuan: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    // Pastikan kolom ini ADA di MODEL Anda
    komentar_dosen: {
        type: DataTypes.TEXT, // Atau STRING(sesuaikan panjangnya jika tidak terlalu panjang)
        allowNull: true // Sesuaikan apakah boleh null atau tidak
    }
}, {
    tableName: 'pengajuan_magang',
    timestamps: false
});

PengajuanMagang.associate = (models) => {
    // ... relasi lain ...
    PengajuanMagang.hasMany(models.Dokumen, {
        foreignKey: 'pengajuan_id',
        as: 'dokumen'
    });
};

module.exports = PengajuanMagang;
