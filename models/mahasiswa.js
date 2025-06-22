<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Mahasiswa = sequelize.define('Mahasiswa', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    dosen_pembimbing_id: { // Kolom yang baru ditambahkan
        type: DataTypes.INTEGER,
        allowNull: true // Bisa null jika belum ada dosen pembimbing
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    npm: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    jurusan: { // Diubah dari 'prodi' di dummy ke 'jurusan' di DB
        type: DataTypes.STRING(100),
        allowNull: false
    },
    angkatan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    no_hp: {
        type: DataTypes.STRING(15)
    }
}, {
    tableName: 'mahasiswa',
    timestamps: false
});

=======
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Mahasiswa = sequelize.define('Mahasiswa', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    dosen_pembimbing_id: { // Kolom yang baru ditambahkan
        type: DataTypes.INTEGER,
        allowNull: true // Bisa null jika belum ada dosen pembimbing
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    npm: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    jurusan: { // Diubah dari 'prodi' di dummy ke 'jurusan' di DB
        type: DataTypes.STRING(100),
        allowNull: false
    },
    angkatan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    no_hp: {
        type: DataTypes.STRING(15)
    }
}, {
    tableName: 'mahasiswa',
    timestamps: false
});

>>>>>>> 03d0be88ae68d2002cbd1ca11dddb146e91326a8
module.exports = Mahasiswa;