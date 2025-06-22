const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const TemplateDokumen = sequelize.define('TemplateDokumen', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama_template: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    file_path: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'template_dokumen',
    timestamps: false
});

module.exports = TemplateDokumen;