const axios = require('axios');

class NutritionController {
    async fetchNutrition(req, res) {
        const { query } = req.query; // e.g., search for "apple" or "banana"
        if (!query) {
            return res.render('nutrition', {
                title: 'Nutrition',
                nutritionData: [],
                errorMessage: 'Please enter a food item to search.',
            });
        }

        try {
            const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
                headers: {
                    'x-app-id': process.env.NUTRITION_APP_ID,
                    'x-app-key': process.env.NUTRITION_API_KEY,
                },
                params: {
                    query,
                },
            });

            const commonFoods = response.data.common || [];
            const brandedFoods = response.data.branded || [];

            const nutritionData = [...commonFoods, ...brandedFoods].map((item) => ({
                name: item.food_name,
                brand: item.brand_name || 'Generic',
                calories: item.nf_calories,
                fat: item.nf_total_fat,
                protein: item.nf_protein,
            }));

            res.render('nutrition', {
                title: 'Nutrition',
                nutritionData,
                errorMessage: null,
            });
        } catch (err) {
            console.error('Error fetching nutrition data:', err);
            res.render('nutrition', {
                title: 'Nutrition',
                nutritionData: [],
                errorMessage: 'Failed to fetch nutrition data. Please try again later.',
            });
        }
    }
}

module.exports = new NutritionController();
