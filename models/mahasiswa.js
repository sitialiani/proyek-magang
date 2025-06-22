'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan semua relasi untuk Mahasiswa di sini

      // Mahasiswa dimiliki oleh satu User
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // Mahasiswa dibimbing oleh satu Dosen
      this.belongsTo(models.Dosen, {
        foreignKey: 'dosen_pembimbing_id',
        as: 'dosen'
      });

      this.hasMany(models.PengajuanMagang, {
        foreignKey: 'mahasiswa_id',
        as: 'pengajuanMagangs'
      });

      // Relasi lain jika ada (misal: ke Laporan)
      this.hasMany(models.Laporan, {
        foreignKey: 'mahasiswa_id',
        as: 'laporans'
      });

      // Relasi ke Logbook
      this.hasMany(models.Logbook, {
        foreignKey: 'mahasiswa_id',
        as: 'logbooks'
      });
    }
  }

  Mahasiswa.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    dosen_pembimbing_id: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nim: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    jurusan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    angkatan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_hp: {
      type: DataTypes.STRING(15)
    }
  }, {
    sequelize,
    modelName: 'Mahasiswa',
    tableName: 'mahasiswa',
    timestamps: false
  });

  return Mahasiswa;
};
