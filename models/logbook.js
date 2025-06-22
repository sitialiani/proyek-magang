const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Logbook = sequelize.define('Logbook', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATEONLY, // DATEONLY untuk hanya tanggal
        allowNull: false
    },
    kegiatan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    verifikasi_dosen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'logbook',
    timestamps: false
});

module.exports = Logbook;