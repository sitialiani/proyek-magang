// lowongan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Lowongan = sequelize.define('Lowongan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  perusahaan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'perusahaan',
      key: 'id'
    }
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
    type: DataTypes.DATE
  },
  tanggal_ditutup: {
    type: DataTypes.DATE
  },
  link_berkas: {
    type: DataTypes.STRING(2500)
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
    type: DataTypes.DATE
  }
}, {
  tableName: 'lowongan',
  timestamps: false
});

module.exports = Lowongan;
