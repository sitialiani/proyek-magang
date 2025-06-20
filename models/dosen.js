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
      // define association here
    }
  }
  Dosen.init({
    nama: DataTypes.STRING,
    nidn: DataTypes.STRING,
    email: DataTypes.STRING,
    telepon: DataTypes.STRING,
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
    modelName: 'Dosen',
  });
  return Dosen;
};