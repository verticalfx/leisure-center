const axios = require('axios');
const express = require("express")
const MainController = require('../controllers/MainController');
const UserController = require('../controllers/UserController');
const ClassesController = require('../controllers/ClassesController')
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router()

router.get('/', MainController.getIndex);
router.get('/about', MainController.getAbout);
router.get('/register', UserController.showRegisterForm);
router.get('/login', UserController.showLoginForm);
router.get('/logout', UserController.logout);
router.get('/classes', ensureAuthenticated, ClassesController.renderClassesPage)

module.exports = router  