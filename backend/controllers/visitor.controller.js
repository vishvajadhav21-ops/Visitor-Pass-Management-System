const Visitor = require('../models/Visitor.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register a new visitor (with optional photo upload)
// @route   POST /api/visitors
// @access  Private (Frontdesk, Employee, Admin)
const registerVisitor = asyncHandler(async (req, res) => {

  const {
    name,
    email,
    phone,
    company,
    idProofType,
    idProofNumber,
    purposeOfVisit,
    hostEmployee,
  } = req.body;

  const visitor = await Visitor.create({
    name,
    email,
    phone,
    company,
    idProofType,
    idProofNumber,
    purposeOfVisit,
    hostEmployee: hostEmployee || null,
    registeredBy: req.user.id, // set by verifyToken middleware
    photoUrl: req.file ? req.file.path : null, // Cloudinary URL from multer-storage-cloudinary
  });

  res.status(201).json({ success: true, visitor });
});

// @desc    Get all visitors (supports basic filtering)
// @route   GET /api/visitors?host=&search=
// @access  Private (Frontdesk, Employee, Admin)
const getAllVisitors = asyncHandler(async (req, res) => {
  const { host, search } = req.query;
  const filter = {};

  if (host) filter.hostEmployee = host;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const visitors = await Visitor.find(filter)
    .populate('hostEmployee', 'name email department')
    .populate('registeredBy', 'name role')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: visitors.length, visitors });
});

// @desc    Get a single visitor by ID
// @route   GET /api/visitors/:id
// @access  Private
const getVisitorById = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id)
    .populate('hostEmployee', 'name email department')
    .populate('registeredBy', 'name role');

  if (!visitor) {
    res.status(404);
    throw new Error('Visitor not found');
  }

  res.status(200).json({ success: true, visitor });
});

// @desc    Update visitor details
// @route   PUT /api/visitors/:id
// @access  Private (Frontdesk, Admin)
const updateVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    res.status(404);
    throw new Error('Visitor not found');
  }

  const fields = ['name', 'email', 'phone', 'company', 'idProofType', 'idProofNumber', 'purposeOfVisit', 'hostEmployee'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) visitor[field] = req.body[field];
  });

  if (req.file) {
    visitor.photoUrl = req.file.path;
  }

  await visitor.save();

  res.status(200).json({ success: true, visitor });
});

// @desc    Delete a visitor
// @route   DELETE /api/visitors/:id
// @access  Private/Admin
const deleteVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    res.status(404);
    throw new Error('Visitor not found');
  }

  await visitor.deleteOne();

  res.status(200).json({ success: true, message: 'Visitor deleted successfully' });
});

module.exports = {
  registerVisitor,
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
};