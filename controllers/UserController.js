const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

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
    const { first_name, last_name, date_of_birth, email, phone_number, password } = req.body;
    try {
      await UserModel.registerUser({ first_name, last_name, date_of_birth, email, phone_number, password });
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering user');
    }
  }

  showLoginForm(req, res) {
    res.render('login', { title: 'Login' });
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.loginUser(email, password);
      if (!user) {
        return res.status(401).render('login', { title: 'Login', error: 'Invalid email or password' });
      }

      // Create JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      // Set token as a cookie for authenticated routes
      res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in');
    }
  }

  logout(req, res) {
    // Clear the token cookie
    res.clearCookie('token');
    res.redirect('/login');
  }
}

module.exports = new UserController();
