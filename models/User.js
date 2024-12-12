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
    console.log('[CHECKPOINT] Starting user registration process');

    try {
      console.log('[CHECKPOINT] Validating email existence for:', email);

      // Check if the email already exists
      const emailCheckSql = `SELECT id FROM users WHERE email = ?`;
      const [emailResults] = await db.query(emailCheckSql, [email]); // Await the query result

      if (emailResults.length > 0) {
        console.log('[CHECKPOINT] Email already exists:', email);
        throw new Error('Email already exists');
      }

      console.log('[CHECKPOINT] Email does not exist, proceeding with password hashing');

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      console.log('[CHECKPOINT] Password hashed successfully');

      const registration_date = new Date().toISOString().slice(0, 10);
      console.log('[CHECKPOINT] Registration date generated:', registration_date);

      const insertUserSql = `
        INSERT INTO users (first_name, last_name, date_of_birth, email, phone_number, password, registration_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      console.log('[CHECKPOINT] Preparing to execute user registration query');

      // Execute the query to insert user
      const [insertResults] = await db.query(insertUserSql, [
        first_name,
        last_name,
        date_of_birth,
        email,
        phone_number,
        hashedPassword,
        registration_date,
      ]);

      console.log('[SUCCESS] User successfully registered with email:', email);
      return insertResults; // Return the results of the query
    } catch (err) {
      console.error('[ERROR] Error during registration:', err.message);
      throw err; // Re-throw the error for proper error handling
    }
  },

  async loginUser(email, password) {
    console.log('[CHECKPOINT] Starting login process for email:', email);

    try {
      // Check if the user exists by email
      const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
      const [results] = await db.query(sql, [email]);

      if (results.length === 0) {
        console.log('[CHECKPOINT] No user found with email:', email);
        return null; // No user found
      }

      console.log('[CHECKPOINT] User found, verifying password');
      const user = results[0];

      // Verify password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log('[CHECKPOINT] Password mismatch for email:', email);
        return null; // Password does not match
      }

      console.log('[CHECKPOINT] Password verified, logging in user');

      // Return user object without the password field
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('[ERROR] Error during login process:', error.message);
      throw error; // Re-throw the error for higher-level handling
    }
  },

  async getUserById(id) {
    try {
      const sql = 'SELECT id, first_name, last_name, email, phone_number, registration_date FROM users WHERE id = ? LIMIT 1';
      const [results] = await db.query(sql, [id]);
      return results.length > 0 ? results[0] : null; // Return the user if found, else null
    } catch (error) {
      console.error('[ERROR] Error fetching user by ID:', error.message);
      throw error;
    }
  },

  async getAllInstructors() {
    try {
      const [rows] = await db.query(
        `
        SELECT id, first_name, last_name, email, phone_number
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

};
