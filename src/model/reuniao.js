const Sequelize = require('sequelize');
const sala = require('./sala');
const database = require('../config/db');

const reuniao = database.define('Reuniao', {
    IdReuniao: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    Assunto: {
        type: Sequelize.STRING(50),
        allowNull: false
    },

    HorarioInicio: {
        type: Sequelize.DATE(6),
        allowNull: false
    },

    HorarioFim: {
        type: Sequelize.DATE(6),
        allowNull: false
    },

    Observacoes: {
        type: Sequelize.STRING(255),
        allowNull: true
    },

    Setor: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
});

reuniao.belongsTo(sala,{
    constraint: true,
    foreignKey: 'IDSala'
});

module.exports = reuniao;