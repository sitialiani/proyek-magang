<<<<<<< HEAD
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Logbook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Logbook.belongsTo(models.Mahasiswa, {
        foreignKey: 'mahasiswa_id',
        as: 'Mahasiswa'
      });
    }
  }
  Logbook.init({
    mahasiswa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'mahasiswa',
        key: 'id'
      }
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    kegiatan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    verifikasi_dosen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    komentar_dosen: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Logbook',
    tableName: 'logbook',
    timestamps: true
  });
  return Logbook;
}; 
=======
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Logbook = sequelize.define('Logbook', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATEONLY, // DATEONLY untuk hanya tanggal
        allowNull: false
    },
    kegiatan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    verifikasi_dosen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'logbook',
    timestamps: false
});

module.exports = Logbook;
>>>>>>> 7e7ac080241c89bb016f2879b7eaf063e8d85df5
