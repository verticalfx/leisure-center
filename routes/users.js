const express = require('express');
const UserController = require('../controllers/UserController');
const { validateRegistration, validateLogin } = require('../validators/validators');
const { validationResult } = require('express-validator');

const router = express.Router();

// router.get('/register', UserController.showRegisterForm);
//router.post('/register', validateRegistration, UserController.register);

// router.get('/login', UserController.showLoginForm);
//router.post('/login', validateLogin, UserController.login);

router.post(
  '/register',
  validateRegistration,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        title: 'Register',
        errors: errors.array(), // Send validation errors to the view
      });
    }
    next(); // Proceed to the controller
  },
  UserController.register
);

router.post(
  '/login',
  validateLogin,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('login', {
        title: 'Login',
        errors: errors.array(),
      });
    }
    next();
  },
  UserController.login
);


// router.get('/logout', UserController.logout);

router.get('/api', UserController.getUser);

module.exports = router;
