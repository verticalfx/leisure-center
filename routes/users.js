const express = require('express');
const UserController = require('../controllers/UserController');
const { validateRegistration, validateLogin } = require('../validators/userValidators');
const { validationResult } = require('express-validator');

const router = express.Router();

// router.get('/register', UserController.showRegisterForm);
router.post('/register', validateRegistration, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('register', { title: 'Register', errors: errors.array() });
  }
  next();
}, UserController.register);

// router.get('/login', UserController.showLoginForm);
router.post('/login', validateLogin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('login', { title: 'Login', errors: errors.array() });
  }
  next();
}, UserController.login);

router.get('/logout', UserController.logout);

module.exports = router;
