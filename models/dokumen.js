const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Dokumen = sequelize.define('Dokumen', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pengajuan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nama_file: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    jenis: {
        type: DataTypes.ENUM('CV', 'transkrip', 'surat', 'proposal', 'lainnya'),
        allowNull: false
    },
    file_path: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tanggal_upload: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'dokumen',
    timestamps: false
});

module.exports = Dokumen;