const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Mitra = sequelize.define('Mitra', {
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
    type: DataTypes.STRING(255),
    allowNull: false
  },
  kontak: {
    type: DataTypes.STRING(150),
    allowNull: false
  }
}, {
  tableName: 'mitra_perusahaan',
  timestamps: false
});

module.exports = Mitra;
