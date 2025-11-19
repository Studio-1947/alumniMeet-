const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Route: POST /api/auth/signup - registers a new alumni
router.post(
  '/signup',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('batchYear').isInt({ min: 1900 }).withMessage('Valid batch year is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('currentStatus').notEmpty().withMessage('Current status is required'),
    body('shortBio').optional().isLength({ max: 500 }).withMessage('Short bio max length is 500 chars'),
    body('skills').optional().isArray().withMessage('Skills should be an array of strings'),
  ],
  registerUser
);

// Route: POST /api/auth/login - authenticates existing user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

module.exports = router;
