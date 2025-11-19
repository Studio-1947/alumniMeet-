const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * POST /api/auth/signup
 * Registers a new user and returns a token + public profile.
 */
const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fullName,
      email,
      password,
      batchYear,
      department,
      currentStatus,
      currentRole,
      currentOrganization,
      location,
      shortBio,
      linkedinUrl,
      portfolioUrl,
      skills,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      batchYear,
      department,
      currentStatus,
      currentRole,
      currentOrganization,
      location,
      shortBio,
      linkedinUrl,
      portfolioUrl,
      skills,
    });

    const token = generateToken(user._id);
    // Store token in an http-only cookie for simple auth persistence
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user with email/password and returns a JWT + public profile.
 */
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Include password explicitly to compare hashes
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Strip password from response
    const userSafe = user.toJSON();
    res.json({ user: userSafe, token });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
