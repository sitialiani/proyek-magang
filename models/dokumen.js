'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dokumen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Dokumen.init({
    pengajuan_id: DataTypes.INTEGER,
    nama_file: DataTypes.STRING,
    jenis: DataTypes.STRING,
    file_path: DataTypes.TEXT,
    tanggal_upload: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Dokumen',
    tableName: 'dokumen',
    timestamps: false
  });
  return Dokumen;
};