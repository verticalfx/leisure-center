const axios = require('axios');
const express = require("express")
const { MainController } = require('../controllers/MainController');
const router = express.Router()

router.get('/', MainController.getIndex.bind(MainController));
router.get('/about', MainController.getAbout.bind(MainController));

module.exports = router  