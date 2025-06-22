const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Rekapitulasi = sequelize.define('Rekapitulasi', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true // One-to-One
    },
    nilai_akhir: {
        type: DataTypes.FLOAT
    },
    status_laporan: {
        type: DataTypes.ENUM('selesai', 'revisi', 'belum'),
        allowNull: false
    },
    tanggal_rekap: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'rekapitulasi',
    timestamps: false
});

module.exports = Rekapitulasi;
