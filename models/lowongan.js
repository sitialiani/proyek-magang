'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lowongan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Perusahaan, {
        foreignKey: 'perusahaan_id',
        as: 'detailPerusahaan' // Alias untuk menghindari konflik nama
      });

      this.hasMany(models.PengajuanMagang, {
        foreignKey: 'lowongan_id',
        as: 'pengajuanMagangs'
      });
    }
  }
  Lowongan.init({
    // Atribut ini sekarang sesuai dengan konfirmasi Anda
    perusahaan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    perusahaan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lokasi: {
      type: DataTypes.STRING
    },
    durasi: {
      type: DataTypes.STRING
    },
    deadlinependaftaran: {
      type: DataTypes.DATEONLY
    },
    deskripsi: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Lowongan',
    tableName: 'lowongan', 
    timestamps: false 
  });
  return Lowongan;
};
