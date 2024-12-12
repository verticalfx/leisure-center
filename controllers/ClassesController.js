const classesModel = require('../models/Classes');
const facilitiesModel = require('../models/Facilities');
const usersModel = require('../models/User');

module.exports = {
  async renderClassesPage(req, res) {
    try {

      if (!req.isAuthenticated) {
        console.warn('[AUTH] Unauthorized access attempt to renderClassesPage');
        return res.redirect('login');
      }
      const classes = await classesModel.getAllClassesWithBookings();
      const facilities = await facilitiesModel.getAllFacilities();
      const instructors = await usersModel.getAllInstructors();
      res.render('classes', { classes, facilities, instructors });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).send('Internal server error');
    }
  },

  // POST
  async createClass(req, res) {
    const { name, facility_id, schedule, start_time, end_time, instructor_id } = req.body;
    try {
      await classesModel.createClass({
        name,
        facility_id,
        schedule,
        start_time,
        end_time,
        instructor_id,
      });
      res.redirect('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
      res.status(500).send('Internal server error');
    }
  },

  // GET /api/classes 
  async getAllClasses(req, res) {
    try {
      const classes = await classesModel.getAllClasses();
      const userBookings = req.isAuthenticated
        ? await classesModel.getUserBookings(req.user.id)
        : [];

      const classesWithBookingStatus = classes.map(cls => ({
        ...cls,
        isBooked: userBookings.includes(cls.class_id),
      }));

      res.json({
        isAuthenticated: req.isAuthenticated || false,
        classes: classesWithBookingStatus,
      });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /api/classes/:id
  async getClassById(req, res) {
    const { id } = req.params;
    try {
      const classDetails = await classesModel.getClassWithBookings(id);
      if (!classDetails) {
        return res.status(404).send('Class not found');
      }
      res.render('classDetails', { classDetails });
    } catch (error) {
      console.error('Error fetching class details:', error);
      res.status(500).send('Internal server error');
    }
  },

  // GET /api/classes/date/:date (e.g., /api/classes/date/2024-12-10)
  async getClassesByDate(req, res) {
    const { date } = req.params;
    try {
      const classes = await classesModel.getClassesByDate(date);
      const classesWithDuration = classes.map(cls => {
        const duration = computeDuration(cls.start_time, cls.end_time);
        return { ...cls, duration };
      });
      res.json(classesWithDuration);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /api/classes/search?query=<search-term>
  async searchClasses(req, res) {
    const { query } = req.query;
    try {
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      // Fetch classes matching the query, including facility_name
      const classes = await classesModel.searchClasses(query);

      // Compute duration and format the response
      const classesWithDetails = classes.map(cls => {
        const duration = computeDuration(cls.start_time, cls.end_time);
        return { ...cls, duration };
      });

      res.json(classesWithDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async bookClass(req, res) {
    const { class_id } = req.body;

    if (!class_id) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    try {
      const user_id = req.user.id;

      // Check if user is already booked
      const isBooked = await classesModel.checkIfBooked({ user_id, class_id });

      if (isBooked) {
        return res.status(400).json({ error: "You are already booked for this class" });
      }

      // Proceed with booking
      await classesModel.bookClass({ user_id, class_id });
      res.status(200).json({ message: "Successfully booked the class!" });
    } catch (error) {
      console.error("Error booking class:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

};

function computeDuration(start_time, end_time) {
  const start = new Date(`1970-01-01T${start_time}`);
  const end = new Date(`1970-01-01T${end_time}`);
  const diffMs = end - start;
  const diffMins = diffMs / 60000;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return (hours > 0 ? hours + 'h ' : '') + (mins > 0 ? mins + 'm' : (hours === 0 ? '0m' : ''));
}
