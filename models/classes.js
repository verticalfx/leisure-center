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
  },

  async searchClasses(query) {
    const searchQuery = `%${query}%`;
    const [rows] = await db.query(
      `SELECT c.class_id, c.name AS class_name, c.start_time, c.end_time, 
                CONCAT(u.first_name, ' ', u.last_name) AS instructor_name,
                f.name AS facility_name
         FROM classes c
         JOIN users u ON c.instructor_id = u.id
         JOIN facilities f ON c.facility_id = f.facility_id
         WHERE c.name LIKE ? OR f.name LIKE ? OR CONCAT(u.first_name, ' ', u.last_name) LIKE ?`,
      [searchQuery, searchQuery, searchQuery]
    );
    return rows;
  },


  async getAllClassesWithBookings() {
    const [rows] = await db.query('CALL get_all_classes_with_bookings()');
    return rows[0];
  },

  async getClassWithBookings(classId) {
    const [rows] = await db.query('CALL get_class_with_bookings(?)', [classId]);
    return rows[0][0];
  },

  // Create a new class
  async createClass({ name, facility_id, schedule, start_time, end_time, instructor_id }) {
    await db.query(
      'CALL create_class(?, ?, ?, ?, ?, ?)',
      [name, facility_id, schedule, start_time, end_time, instructor_id]
    );
  },

  async getAllInstructors() {
    try {
      const [rows] = await db.query(
        `
        SELECT id, first_name, last_name, email
        FROM users
        WHERE role_id = (SELECT role_id FROM roles WHERE role_name = 'Employee')
        `
      );
      return rows;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  async bookClass({ user_id, class_id }) {
    if (!class_id) {
      throw new Error("Class ID cannot be null");
    }

    const [result] = await db.query(
      "INSERT INTO user_classes (user_id, class_id, registration_date) VALUES (?, ?, CURRENT_DATE)",
      [user_id, class_id]
    );
    return result;
  },

  async checkIfBooked({ user_id, class_id }) {
    const [rows] = await db.query(
      "SELECT * FROM user_classes WHERE user_id = ? AND class_id = ?",
      [user_id, class_id]
    );
    return rows.length > 0;
  },

  async getUserBookings(userId) {
    const [rows] = await db.query(
      `SELECT class_id FROM user_classes WHERE user_id = ?`,
      [userId]
    );
    return rows.map(row => row.class_id); // Return array of booked class IDs
  }
};
