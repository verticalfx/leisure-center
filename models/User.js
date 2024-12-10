const db = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports = {
  getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query('SELECT id, first_name, last_name, date_of_birth, email, phone_number, registration_date FROM users', (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  },

  async registerUser({ first_name, last_name, date_of_birth, email, phone_number, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const registration_date = new Date().toISOString().slice(0, 10);

        const sql = `INSERT INTO users (first_name, last_name, date_of_birth, email, phone_number, password, registration_date) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [first_name, last_name, date_of_birth, email, phone_number, hashedPassword, registration_date], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  async loginUser(email, password) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
      db.query(sql, [email], async (error, results) => {
        if (error) return reject(error);

        if (results.length === 0) {
          // No user found with that email
          return resolve(null);
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return resolve(null);
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      });
    });
  }
};
