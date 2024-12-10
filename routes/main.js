const axios = require('axios');
const express = require("express")
const MainController = require('../controllers/MainController');
const UserController = require('../controllers/UserController');

const router = express.Router()

router.get('/', MainController.getIndex);
router.get('/about', MainController.getAbout);
router.get('/register', UserController.showRegisterForm);
router.get('/login', UserController.showLoginForm);
router.get('/logout', UserController.logout);

module.exports = router  