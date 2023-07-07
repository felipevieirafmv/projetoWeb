// Iniciando Route do Express
const express = require('express');
const route = express.Router();

// Importando os Controllers
const index = require('./src/controllers/index');
const main = require('./src/controllers/main');
const mapa = require('./src/controllers/mapa');
const reunioes = require('./src/controllers/reunioes');
const salas = require('./src/controllers/salas');

// Iniciando as rotas
route.get('/', index.pagInicialGet).post('/login', index.pagInicialPost);
route.get('/main', main.mainGet).post('/main', main.mainPost);
route.get('/mapa', mapa.mapaGet);
route.get('/reunioes', reunioes.reunioesGet);
route.get('/salas', salas.salasGet).post('/salas', salas.goSector);
route.get('/logout', index.logout);

module.exports = route;