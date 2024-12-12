require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const sessions = require('express-session');
const expressSanitizer = require('express-sanitizer');
const cookieParser = require('cookie-parser');
const xssClean = require('xss-clean');
const jwt = require('jsonwebtoken');
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/users')
const classesRoutes = require('./routes/classes')
const workoutRoutes = require('./routes/workouts')
const nutritionRoutes = require('./routes/nutrition')
const connection = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(xssClean());
app.use(express.json());

app.use(sessions({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.use((req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = { id: decoded.id, email: decoded.email }; 
    } catch (err) {
      console.error('Invalid token:', err);
      res.locals.user = null; // If token invalid, user is null
    }
  } else {
    res.locals.user = req.session.user || null; // Fallback to session-based user
  }
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});


//app.use(expressSanitizer());

// Route handling
app.use('/', mainRoutes);
app.use('/user', userRoutes);
app.use('/api/classes', classesRoutes);
app.use('/workouts', workoutRoutes)
app.use('/nutrition', nutritionRoutes)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Website name: ${process.env.WEBSITE_NAME}`);
});
