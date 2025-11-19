const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { getMe, updateMe, listUsers, getUserById } = require('../controllers/userController');

const router = express.Router();

// Route: GET /api/users - public alumni directory with search and filters
router.get('/', listUsers);

// Route: GET /api/users/me - get the logged-in user's profile
router.get('/me', protect, getMe);

// Route: PUT /api/users/me - update the logged-in user's profile
router.put(
  '/me',
  protect,
  [
    body('fullName').optional().notEmpty(),
    body('batchYear').optional().isInt({ min: 1900 }),
    body('department').optional().notEmpty(),
    body('currentStatus').optional().notEmpty(),
    body('shortBio').optional().isLength({ max: 500 }),
    body('skills').optional().isArray(),
  ],
  updateMe
);

// Route: GET /api/users/:id - get a single alumni public profile
router.get('/:id', getUserById);

module.exports = router;
