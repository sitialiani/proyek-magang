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