'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Backup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Jika ingin melacak siapa yang membuat backup
      // this.belongsTo(models.User, {
      //   foreignKey: 'createdBy',
      //   as: 'creator'
      // });
    }
  }
  Backup.init({
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.BIGINT, // Simpan dalam bytes
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    // createdBy: DataTypes.INTEGER, // Foreign key ke User
  }, {
    sequelize,
    modelName: 'Backup',
    tableName: 'backup',
    timestamps: true,
    underscored: true,
  });
  return Backup;
};