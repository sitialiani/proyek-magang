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
  deskripsi: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'lowongan',
  timestamps: false
});

module.exports = Lowongan;