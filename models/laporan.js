<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Laporan = sequelize.define('Laporan', {
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
    judul: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    file_path: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('belum dikumpulkan', 'menunggu', 'revisi', 'diterima'),
        allowNull: false
    },
    tanggal_upload: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'laporan',
    timestamps: false
});

=======
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Laporan = sequelize.define('Laporan', {
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
    judul: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    file_path: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('belum dikumpulkan', 'menunggu', 'revisi', 'diterima'),
        allowNull: false
    },
    tanggal_upload: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'laporan',
    timestamps: false
});

>>>>>>> 03d0be88ae68d2002cbd1ca11dddb146e91326a8
module.exports = Laporan;