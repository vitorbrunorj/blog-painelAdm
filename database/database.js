const Sequelize = require('sequelize');

const connection = new Sequelize('guiapress', 'root', 'MINHASENHA', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = connection;