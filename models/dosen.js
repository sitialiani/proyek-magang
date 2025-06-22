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