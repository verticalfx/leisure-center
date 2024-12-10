require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const sessions = require('express-session');
const expressSanitizer = require('express-sanitizer');
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/users')
const classesRoutes = require('./routes/classes')
const connection = require('./config/db');

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

app.use(expressSanitizer());

// Route handling
app.use('/', mainRoutes);
app.use('/user', userRoutes);
app.use('/api/classes', classesRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Website name: ${process.env.WEBSITE_NAME}`);
});
