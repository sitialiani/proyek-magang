module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'sistem_magang',
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
