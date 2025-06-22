require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistem_magang',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    supportPerusahaan: process.env.SUPPORT_PERUSAHAAN !== 'false'
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistem_magang_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    supportPerusahaan: process.env.SUPPORT_PERUSAHAAN !== 'false'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    supportPerusahaan: process.env.SUPPORT_PERUSAHAAN !== 'false'
  }
};