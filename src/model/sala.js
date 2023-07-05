const Sequelize = require('sequelize');
const database = require('../config/db');

const sala = database.define('Sala', {
    IdSala: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    Nome: {
        type: Sequelize.STRING(50),
        allowNull: false
    },

    Capacidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    Setor: {
        type: Sequelize.STRING(50),
        allowNull: false
    },

    FotoSala: {
        type: Sequelize.STRING(255)
    }
});

module.exports = sala;