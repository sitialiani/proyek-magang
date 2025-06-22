const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Perusahaan = sequelize.define('Perusahaan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telepon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'perusahaan',
  timestamps: false,
});

module.exports = Perusahaan;
