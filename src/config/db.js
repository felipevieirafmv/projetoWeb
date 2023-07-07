const sequelize = require('sequelize');

//configurações da base de dados
const database = new sequelize('projetoWeb', 'VieiraTavares', 'etstech31415',
{
dialect: 'mssql', host:'localhost', port: 50181
});

database.sync();

module.exports = database;