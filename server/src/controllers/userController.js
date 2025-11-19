const { validationResult } = require('express-validator');
const User = require('../models/User');

// Fields exposed publicly (email/password excluded)
const publicFields =
  'fullName batchYear department currentStatus currentRole currentOrganization location shortBio linkedinUrl portfolioUrl skills createdAt updatedAt';

/**
 * GET /api/users/me
 * Returns the authenticated user's profile.
 */
const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/me
 * Allows the current user to update their profile (excluding email/password changes).
 */
const updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Prevent email/password updates via this route
    const disallowed = ['email', 'password'];
    disallowed.forEach((field) => delete req.body[field]);

    const updated = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ user: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users
 * Paginated directory with optional search/filtering.
 */
const listUsers = async (req, res, next) => {
  try {
    const {
      q,
      department,
      batchYear,
      currentStatus,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { fullName: regex },
        { currentOrganization: regex },
        { currentRole: regex },
        { location: regex },
      ];
    }

    if (department) filter.department = department;
    if (batchYear) filter.batchYear = Number(batchYear);
    if (currentStatus) filter.currentStatus = currentStatus;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select(publicFields)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    res.json({
      data: users,
      page: pageNum,
      totalPages,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Returns the public profile of a single alumni.
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(publicFields);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateMe, listUsers, getUserById };
