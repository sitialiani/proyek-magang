const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Penilaian = sequelize.define('Penilaian', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  mahasiswa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true // Relasi One-to-One
  },
  dosen_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // --- PENAMBAHAN ATRIBUT BARU ---
  laporan_id: { // Tambahkan ini
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // --- AKHIR PENAMBAHAN ---
  nilai_akhir: {
    type: DataTypes.FLOAT
  },
  komentar: {
    type: DataTypes.TEXT
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'penilaian',
  timestamps: false
});

module.exports = Penilaian;
