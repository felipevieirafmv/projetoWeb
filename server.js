const express = require('express');
const routes = require('./routes');
const database = require('./src/config/db');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const app = express();

const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: 'senhadificil456',
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// EJS
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(routes);

app.listen(3000, () => console.log('Acesse: http://localhost:3000/'));