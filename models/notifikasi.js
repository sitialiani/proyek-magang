const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Notifikasi = sequelize.define('Notifikasi', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    judul: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    pesan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    dibaca: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tanggal_kirim: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'notifikasi',
    timestamps: false
});

module.exports = Notifikasi;