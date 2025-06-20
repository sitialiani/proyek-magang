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
      // Mahasiswa memiliki banyak Laporan
      this.hasMany(models.Laporan, { foreignKey: 'mahasiswa_id' });
      
      // Mahasiswa dimiliki oleh satu User
      this.belongsTo(models.User, { foreignKey: 'user_id' });

      // Mahasiswa dibimbing oleh satu Dosen
      this.belongsTo(models.Dosen, { foreignKey: 'dosen_id' });
    }
  }
  Mahasiswa.init({
    nama: DataTypes.STRING,
    nim: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    angkatan: DataTypes.INTEGER,
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Nama tabel yang direferensikan (plural)
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // atau SET NULL, tergantung kebutuhan
}
  }, {
    sequelize,
    modelName: 'Mahasiswa',
  });
  return Mahasiswa;
};

