// src/models/PengajuanMagang.js
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
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    // Pastikan kolom ini ADA di MODEL Anda
    komentar_dosen: {
        type: DataTypes.TEXT, // Atau STRING(sesuaikan panjangnya jika tidak terlalu panjang)
        allowNull: true // Sesuaikan apakah boleh null atau tidak
    }
}, {
    tableName: 'pengajuan_magang',
    timestamps: false
});

PengajuanMagang.associate = (models) => {
    // ... relasi lain ...
    PengajuanMagang.hasMany(models.Dokumen, {
        foreignKey: 'pengajuan_id',
        as: 'dokumen'
    });
};

module.exports = PengajuanMagang;