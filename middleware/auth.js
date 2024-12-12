const jwt = require('jsonwebtoken');
const UserModel = require('../models/user'); // Ensure this is correctly implemented
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

module.exports = {
  ensureAuthenticated: async (req, res, next) => {
    const token = req.cookies?.token;

    console.log('[AUTH] Checking authentication middleware...');
    if (!token) {
      console.error('[AUTH] No token provided');
      req.isAuthenticated = false;
      req.user = null;
      return next(); // Allow the request but mark as unauthenticated
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('[AUTH] Token decoded:', decoded);

      const user = await UserModel.getUserById(decoded.id);
      if (!user || user.email !== decoded.email) {
        console.error('[AUTH] User not found or email mismatch');
        req.isAuthenticated = false;
        req.user = null;
        return next(); // Allow the request but mark as unauthenticated
      }

      console.log('[AUTH] User authenticated:', user);
      req.isAuthenticated = true;
      req.user = user; // Attach full user object to req.user
      return next(); // Proceed to the next middleware or route handler
    } catch (err) {
      console.error('[AUTH] Invalid token:', err);
      req.isAuthenticated = false;
      req.user = null;
      return next(); // Allow the request but mark as unauthenticated
    }
  },
};
