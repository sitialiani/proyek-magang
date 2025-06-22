<<<<<<< HEAD
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.Dosen, { foreignKey: 'user_id' });
      this.hasOne(models.Mahasiswa, { foreignKey: 'user_id' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.ENUM('mahasiswa', 'dosen', 'admin'),
    status: {
      type: DataTypes.ENUM('Aktif', 'Non-Aktif'),
      defaultValue: 'Aktif'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true, // Biarkan Sequelize mengelola timestamps
    underscored: true, // Otomatis ubah camelCase ke snake_case (createdAt -> created_at)
  });
  return User;
};
=======
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize'); // Path ke file koneksi Sequelize Anda

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('mahasiswa', 'dosen', 'admin'),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users', // Pastikan nama tabel di DB
    timestamps: false // Karena Anda punya created_at manual
});

module.exports = User;
>>>>>>> 7e7ac080241c89bb016f2879b7eaf063e8d85df5
