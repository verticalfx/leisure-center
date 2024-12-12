const db = require('../config/db');

module.exports = {
    async getAllFacilities() {
        try {
            const [rows] = await db.query(
                `
          SELECT facility_id, name, description, open_time, close_time
          FROM facilities
          `
            );

            console.log(rows)
            return rows; // Returns an array of facilities
        } catch (error) {
            console.error('Error fetching facilities:', error);
            throw error; // Re-throw the error for higher-level handling
        }
    },
};