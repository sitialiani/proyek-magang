const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Perusahaan = sequelize.define('Perusahaan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  alamat: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  bidang: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  kontak: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'perusahaan',
  timestamps: false
});

module.exports = Perusahaan;
