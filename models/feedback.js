const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dosen_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pesan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'feedback',
    timestamps: false
});

module.exports = Feedback;