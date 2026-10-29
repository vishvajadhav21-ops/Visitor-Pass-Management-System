const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../utils/constants');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Admin-only in production, depending on your rules)
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  // Note: 'role' is intentionally NOT destructured from req.body here.
  // Public registration can only ever create visitor accounts.
  // Staff accounts (admin/frontdesk/employee) must be created via
  // the protected POST /api/users route by an existing admin.

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: ROLES.VISITOR, // hardcoded — cannot be overridden by the client
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // password field has select:false in the schema, so explicitly include it
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Get currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, user });
});

module.exports = { register, login, getMe };