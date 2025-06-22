'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Sebuah Feedback diberikan oleh satu Dosen
      this.belongsTo(models.Dosen, { foreignKey: 'dosen_id' });
      
      // Sebuah Feedback diberikan untuk satu Mahasiswa
      this.belongsTo(models.Mahasiswa, { foreignKey: 'mahasiswa_id' });
    }
  }
  Feedback.init({
    dosen_id: DataTypes.INTEGER,
    laporan_id: DataTypes.INTEGER,
    pesan: DataTypes.TEXT,
    tanggal: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Feedback',
    tableName: 'feedback',
    timestamps: false
  });
  return Feedback;
};
