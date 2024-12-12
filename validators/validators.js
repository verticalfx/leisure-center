const { body } = require('express-validator');

const validateRegistration = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .escape(),

  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .escape(),

  body('date_of_birth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Date of birth must be in a valid ISO 8601 format (YYYY-MM-DD)')
    .toDate(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be between 10 and 15 digits'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&#]/)
    .withMessage('Password must contain at least one special character')
    .escape(),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

const validateCreateClass = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Class name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Class name must be between 3 and 100 characters'),

  body('facility_id')
    .notEmpty()
    .withMessage('Facility is required')
    .isInt({ min: 1 })
    .withMessage('Facility ID must be a positive integer'),

  body('schedule')
    .notEmpty()
    .withMessage('Schedule date is required')
    .isISO8601()
    .withMessage('Invalid schedule date'),

  body('start_time')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Invalid start time format (HH:mm)'),

  body('end_time')
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Invalid end time format (HH:mm)')
    .custom((end_time, { req }) => {
      const start_time = req.body.start_time;
      if (start_time && start_time >= end_time) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),

  body('instructor_id')
    .notEmpty()
    .withMessage('Instructor is required')
    .isInt({ min: 1 })
    .withMessage('Instructor ID must be a positive integer'),
];

module.exports = { validateRegistration, validateLogin, validateCreateClass };
