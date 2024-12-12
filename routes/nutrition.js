const express = require('express');
const router = express.Router();
const NutritionController = require('../controllers/NutritionController');

router.get('/', NutritionController.fetchNutrition);

module.exports = router;
