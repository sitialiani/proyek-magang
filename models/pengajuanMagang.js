const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const PengajuanMagang = sequelize.define('PengajuanMagang', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lowongan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal_pengajuan: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('diajukan', 'diterima', 'ditolak', 'selesai'),
        allowNull: false
    },
    cv: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transkrip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    krs: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dokumen_pendukung: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verifikasi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'pengajuan_magang',
    timestamps: false
});

module.exports = PengajuanMagang;