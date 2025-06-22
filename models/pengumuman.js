'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pengumuman extends Model {
    static associate(models) {
      // Pengumuman dibuat oleh admin (user)
      this.belongsTo(models.User, {
        foreignKey: 'admin_user_id',
        as: 'admin'
      });
    }
  }
  
  Pengumuman.init({
    admin_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ditujukan_kepada: {
      type: DataTypes.ENUM('mahasiswa', 'dosen', 'semua'),
      allowNull: false,
      defaultValue: 'semua'
    }
  }, {
    sequelize,
    modelName: 'Pengumuman',
    tableName: 'pengumuman',
    timestamps: true
  });
  return Pengumuman;
}; 