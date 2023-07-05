const Sequelize = require('sequelize');
const database = require('../config/db');

const pessoa = database.define('Pessoa', {
    Usuario: {
        type: Sequelize.CHAR(6),
        allowNull: false,
        primaryKey: true
    },

    Senha: {
        type: Sequelize.STRING(50),
        allowNull: false
    },

    Nome: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
});

module.exports = pessoa;