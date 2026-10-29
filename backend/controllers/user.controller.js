const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../utils/constants'); // add if not already imported


// @desc    Get list of employees (hosts) for appointment booking — any logged-in user
// @route   GET /api/users/hosts
// @access  Private (any authenticated user)
const getHostsList = asyncHandler(async (req, res) => {
  const hosts = await User.find({ role: ROLES.EMPLOYEE, isActive: true }).select('name department email');
  res.status(200).json({ success: true, hosts });
});


// @desc    Get all users (optionally filter by role)
// @route   GET /api/users?role=frontdesk
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};

  const users = await User.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, user });
});

// @desc    Create a staff user (admin creating frontdesk/employee accounts)
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, department } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({ name, email, password, role, phone, department });

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Update a user's details
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { name, phone, department, role, isActive } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.department = department ?? user.department;
  user.role = role ?? user.role;
  if (typeof isActive === 'boolean') user.isActive = isActive;

  await user.save();

  res.status(200).json({ success: true, user });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

module.exports = { getAllUsers, getUserById, createUser, getHostsList ,updateUser, deleteUser };