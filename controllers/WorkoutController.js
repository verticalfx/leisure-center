const axios = require('axios');

class WorkoutController {
    // Fetch exercises
    async fetchExercises(req, res) {
        try {
            // Fetch exercises from API
            const response = await axios.get('https://wger.de/api/v2/exercise/', {
                headers: {
                    Authorization: 'Token ' + process.env.GYM_API_KEY,
                },
            });

            const exercises = response.data.results;

            // Fetch categories and equipment from API
            const [categoriesRes, equipmentRes] = await Promise.all([
                axios.get('https://wger.de/api/v2/exercisecategory/'),
                axios.get('https://wger.de/api/v2/equipment/'),
            ]);

            // Transform categories and equipment into maps
            const categories = {};
            categoriesRes.data.results.forEach(category => {
                categories[category.id] = category.name;
            });

            const equipmentMap = {};
            equipmentRes.data.results.forEach(equipment => {
                equipmentMap[equipment.id] = equipment.name;
            });

            // Render workouts view
            res.render('workouts', {
                title: 'Workouts',
                exercises,
                categories,
                equipmentMap,
            });
        } catch (err) {
            console.error('Error fetching workouts:', err);
            res.redirect('/');
        }
    }

    // Fetch detailed exercise information
    async fetchExerciseDetails(req, res) {
        const { id } = req.params;

        try {
            // Fetch exercise details from wger API
            const response = await axios.get(`https://wger.de/api/v2/exercise/${id}/`, {
                headers: {
                    Authorization: 'Token ' + process.env.GYM_API_KEY,
                },
            });

            const exercise = response.data;

            // Fetch categories and equipment again for details view
            const [categoriesRes, equipmentRes] = await Promise.all([
                axios.get('https://wger.de/api/v2/exercisecategory/'),
                axios.get('https://wger.de/api/v2/equipment/'),
            ]);

            // Transform data into maps
            const categories = {};
            categoriesRes.data.results.forEach(category => {
                categories[category.id] = category.name;
            });

            const equipmentMap = {};
            equipmentRes.data.results.forEach(equipment => {
                equipmentMap[equipment.id] = equipment.name;
            });

            // Render exercise details view
            res.render('exercise-details', {
                title: 'Exercise Details',
                exercise,
                categories,
                equipmentMap,
            });
        } catch (err) {
            console.error('Error fetching exercise details:', err);
            res.redirect('workouts');
        }
    }
}

module.exports = new WorkoutController();
