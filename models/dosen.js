<<<<<<< HEAD
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1. Relasi Dosen ke User (One-to-One)
      //    Satu Dosen terhubung ke satu User.
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user' // Alias untuk memanggil data user
      });

      // 2. Relasi Dosen ke Mahasiswa (One-to-Many)
      //    Satu Dosen bisa membimbing banyak Mahasiswa.
      this.hasMany(models.Mahasiswa, {
        foreignKey: 'dosen_pembimbing_id',
        as: 'mahasiswaBimbingan' // Alias untuk memanggil daftar mahasiswa
      });
    }
  }
  Dosen.init({
    user_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    nidn: DataTypes.STRING,
    email: DataTypes.STRING,
    telepon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Dosen',
    tableName: 'dosen',
    timestamps: false
  });
  return Dosen;
};
=======
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Dosen = sequelize.define('Dosen', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nidn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telepon: {
        type: DataTypes.STRING(15)
    }
}, {
    tableName: 'dosen',
    timestamps: false
});

module.exports = Dosen;
>>>>>>> 7e7ac080241c89bb016f2879b7eaf063e8d85df5
