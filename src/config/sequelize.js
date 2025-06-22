// src/config/sequelize.js
const { Sequelize } = require('sequelize');
const config = require('../../config/config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging || false,
    pool: dbConfig.pool || {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test koneksi
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL (Sequelize) has been established successfully.');
        // Sinkronisasi model dengan database (opsional, sangat berguna di dev)
        await sequelize.sync({ alter: true }); // ini diaktifkan, tapi jangan aktifkan ini di production atau sebelum push!
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Keluar dari aplikasi jika koneksi database gagal
    }
}

connectDB(); // Panggil fungsi untuk menguji koneksi saat aplikasi dimulai

module.exports = sequelize;