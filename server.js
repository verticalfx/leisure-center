require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const sessions = require('express-session');
const expressSaniziter = require('express-sanitizer');

const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(sessions({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.use(expressSaniziter());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

global.db = connection

