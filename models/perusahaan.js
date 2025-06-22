const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Perusahaan = sequelize.define('Perusahaan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    alamat: {
        type: DataTypes.TEXT
    },
    email: {
        type: DataTypes.STRING(100)
    },
    telepon: {
        type: DataTypes.STRING(20)
    },
    pic: { // Penanggung jawab
        type: DataTypes.STRING(100)
    }
}, {
    tableName: 'perusahaan',
    timestamps: false
});

module.exports = Perusahaan;