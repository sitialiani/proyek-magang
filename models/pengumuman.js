const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Pengumuman = sequelize.define('Pengumuman', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    admin_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Bisa null jika tidak merujuk ke user admin
    },
    judul: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    isi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    ditujukan_kepada: {
        type: DataTypes.ENUM('semua', 'mahasiswa', 'dosen'),
        allowNull: false
    }
}, {
    tableName: 'pengumuman',
    timestamps: false
});

module.exports = Pengumuman;