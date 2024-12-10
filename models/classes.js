const db = require('../config/db');

module.exports = {
  async getAllClasses() {
    const [rows] = await db.query('SELECT * FROM class_schedules');
    return rows;
  },

  async getClassesByDate(date) {
    const [resultSets] = await db.execute('CALL get_classes_by_date(?)', [date]);
    return resultSets[0]; // first result set
  },

  async getClassById(classId) {
    const [rows] = await db.query('SELECT * FROM class_schedules WHERE class_id = ?', [classId]);
    return rows[0];
  }
};
