const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Lowongan = sequelize.define('Lowongan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  perusahaan: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  lokasi: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  durasi: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  deadlinependaftaran: {
    type: DataTypes.DATEONLY
  },
  perusahaan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    judul: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT
    },
    kualifikasi: {
        type: DataTypes.TEXT
    },
    tanggal_dibuka: {
        type: DataTypes.DATEONLY
    },
    tanggal_ditutup: {
        type: DataTypes.DATEONLY
    },
    link_berkas: {
        type: DataTypes.STRING(2500),
        allowNull: false
    }
}, {
  tableName: 'lowongan',
  timestamps: false
});

module.exports = Lowongan;
