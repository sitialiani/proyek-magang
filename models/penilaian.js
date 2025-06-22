'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penilaian extends Model {
    static associate(models) {
      // Penilaian diberikan oleh dosen
      this.belongsTo(models.Dosen, {
        foreignKey: 'dosen_id',
        as: 'dosen'
      });
      
      // Penilaian untuk mahasiswa
      this.belongsTo(models.Mahasiswa, {
        foreignKey: 'mahasiswa_id',
        as: 'mahasiswa'
      });
    }
  }
  
  Penilaian.init({
    mahasiswa_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dosen_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nilai_akhir: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    komentar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Penilaian',
    tableName: 'penilaian',
    timestamps: true
  });
  return Penilaian;
}; 