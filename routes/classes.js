const express = require('express');
const classesController = require('../controllers/ClassesController');
const router = express.Router();
const { validateCreateClass } = require('../validators/validators');
const { ensureAuthenticated } = require('../middleware/auth');
const { validationResult } = require('express-validator');

router.get('/', ensureAuthenticated, classesController.getAllClasses);
router.get('/date/:date', classesController.getClassesByDate);
router.get('/search', classesController.searchClasses)
router.post(
    '/create',
    ensureAuthenticated,
    validateCreateClass,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    classesController.createClass
);
router.get('/:id', classesController.getClassById);
router.post("/book", ensureAuthenticated, classesController.bookClass);


module.exports = router;
