<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Dosen = sequelize.define('Dosen', {
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
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nidn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telepon: {
        type: DataTypes.STRING(15)
    }
}, {
    tableName: 'dosen',
    timestamps: false
});

=======
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Dosen = sequelize.define('Dosen', {
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
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nidn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telepon: {
        type: DataTypes.STRING(15)
    }
}, {
    tableName: 'dosen',
    timestamps: false
});

>>>>>>> 03d0be88ae68d2002cbd1ca11dddb146e91326a8
module.exports = Dosen;