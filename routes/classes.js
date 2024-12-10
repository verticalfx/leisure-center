const express = require('express');
const classesController = require('../controllers/ClassesController');
const router = express.Router();

// GET all classes
router.get('/', classesController.getAllClasses);

// GET a single class by ID
router.get('/:id', classesController.getClassById);

// GET classes by date
router.get('/date/:date', classesController.getClassesByDate);

module.exports = router;
