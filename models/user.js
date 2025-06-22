const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize'); // Path ke file koneksi Sequelize Anda

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('mahasiswa', 'dosen', 'admin'),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users', // Pastikan nama tabel di DB
    timestamps: false // Karena Anda punya created_at manual
});

module.exports = User;