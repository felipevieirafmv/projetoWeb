const Sequelize = require('sequelize');
const reuniao = require('./reuniao');
const pessoa = require('./pessoa');
const database = require('../config/db');

const pessoaReuniao = database.define('PessoaReuniao', {
    IdPessoaReuniao: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    Responsavel: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

pessoaReuniao.belongsTo(pessoa,{
    constraint: true,
    foreignKey: 'Usuario'
});

pessoaReuniao.belongsTo(reuniao,{
    constraint: true,
    foreignKey: 'IdReuniao'
});

module.exports = pessoaReuniao;