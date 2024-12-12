const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.render('users', { users });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }

  showRegisterForm(req, res) {
    res.render('register', { title: 'Register' });
  }

  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        title: 'Register',
        errors: errors.array(),
      });
    }

    const { first_name, last_name, date_of_birth, email, phone_number, password } = req.body;
    try {
      await UserModel.registerUser({ first_name, last_name, date_of_birth, email, phone_number, password });
      console.log('User registered successfully');
      res.render('login', { title: 'Login', success: 'Registration successful! Please log in.' });
    } catch (error) {
      console.error(error);
      res.status(500).render('register', { title: 'Register', errors: [{ msg: 'Error registering user. Please try again.' }] });
    }
  }


  showLoginForm(req, res) {
    res.render('login', { title: 'Login' });
  }

  async login(req, res) {
    // Run validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('login', {
        title: 'Login',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      const user = await UserModel.loginUser(email, password);
      if (!user) {
        return res.status(401).render('login', { title: 'Login', errors: [{ msg: 'Invalid email or password' }] });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      // Store token in cookies
      res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).render('login', { title: 'Login', errors: [{ msg: 'Error logging in. Please try again.' }] });
    }
  }

  logout(req, res) {
    // Clear the token cookie
    console.log('logging out')
    res.clearCookie('token');
    res.redirect('/');
  }

  async getUser(req, res) {
    const token = req.cookies?.token ?? null; // Retrieve JWT token from cookies
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user information from the database if needed
      const user = await UserModel.getUserById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return user details
      res.json({ id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}

module.exports = new UserController();
