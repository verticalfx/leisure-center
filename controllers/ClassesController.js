const classesModel = require('../models/classes');

module.exports = {
  // GET /api/classes
  async getAllClasses(req, res) {
    try {
      const classes = await classesModel.getAllClasses();
      // Compute duration for each class
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

  // GET /api/classes/:id
  async getClassById(req, res) {
    const { id } = req.params;
    try {
      const cls = await classesModel.getClassById(id);
      if (!cls) {
        return res.status(404).json({ error: 'Class not found' });
      }
      const duration = computeDuration(cls.start_time, cls.end_time);
      res.json({ ...cls, duration });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
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
