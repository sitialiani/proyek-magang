// src/config/sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sistem_magang', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Set to true to see SQL queries in console
    pool: {
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
        // await sequelize.sync({ alter: true }); // ini diaktifkan, tapi jangan aktifkan ini di production atau sebelum push!
        // console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Keluar dari aplikasi jika koneksi database gagal
    }
}

connectDB(); // Panggil fungsi untuk menguji koneksi saat aplikasi dimulai

module.exports = sequelize;