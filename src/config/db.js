const sequelize = require('sequelize');

//configurações da base de dados
const database = new sequelize('projetoWeb', 'VieiraTavares', 'etstech31415',
{
    dialect: 'mssql', 
    host:'localhost', 
    port: 61654,
    timezone: '-03:00'
});

database.sync();

module.exports = database;