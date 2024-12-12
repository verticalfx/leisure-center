const express = require('express');
const router = express.Router();
const WorkoutController = require('../controllers/WorkoutController');

const validateId = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.redirect('workouts');
    }
    next();
};

router.get('/', WorkoutController.fetchExercises);
router.get('/:id', validateId, WorkoutController.fetchExerciseDetails);

module.exports = router;
