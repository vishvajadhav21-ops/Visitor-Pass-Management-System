const { v4: uuidv4 } = require('uuid');
const Pass = require('../models/Pass.model');
const Visitor = require('../models/Visitor.model');
const asyncHandler = require('../utils/asyncHandler');
const { generateQRCode } = require('../services/qrService');
const { generatePassPDF } = require('../services/pdfService');
const { PASS_STATUS } = require('../utils/constants');
const { sendEmail } = require('../services/emailService');


// @desc    Issue a new pass (walk-in or after appointment approval)
// @route   POST /api/passes
// @access  Private (Frontdesk, Admin)
const issuePass = asyncHandler(async (req, res) => {
  const { visitorId, appointmentId, validFrom, validTo } = req.body;

  const visitor = await Visitor.findById(visitorId);
  if (!visitor) {
    res.status(404);
    throw new Error('Visitor not found');
  }

  const qrToken = uuidv4();

  // Generate QR code first
  const qrCodeUrl = await generateQRCode(qrToken);

  // Create the pass record
  const pass = await Pass.create({
    visitor: visitorId,
    appointment: appointmentId || null,
    qrToken,
    qrCodeUrl,
    validFrom: validFrom || new Date(),
    validTo: validTo || new Date(Date.now() + 24 * 60 * 60 * 1000), // default 24hr validity
    status: PASS_STATUS.ACTIVE,
    issuedBy: req.user.id,
  });

  // Generate PDF badge (uses the pass + visitor data)
  const pdfUrl = await generatePassPDF(pass, visitor);
  pass.pdfUrl = pdfUrl;
  await pass.save();


  // Notify visitor their pass is ready — email if available, SMS as backup/addition
  if (visitor.email) {
    await sendEmail({
      to: visitor.email,
      subject: 'Your Visitor Pass is Ready',
      templateName: 'passIssued.html',
      data: {
        visitorName: visitor.name,
        qrCodeUrl,
        pdfUrl,
        validFrom: new Date(pass.validFrom).toLocaleString(),
        validTo: new Date(pass.validTo).toLocaleString(),
      },
    });
  }

  // NOTE: this is where we'll trigger email/SMS to visitor with their pass
  res.status(201).json({ success: true, pass });
});

// @desc    Get all passes (filter by status)
// @route   GET /api/passes?status=active
// @access  Private
const getAllPasses = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const passes = await Pass.find(filter)
    .populate('visitor', 'name phone email photoUrl')
    .populate('issuedBy', 'name role')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: passes.length, passes });
});

// @desc    Get a single pass by ID
// @route   GET /api/passes/:id
// @access  Private
const getPassById = asyncHandler(async (req, res) => {
  const pass = await Pass.findById(req.params.id)
    .populate('visitor')
    .populate('appointment')
    .populate('issuedBy', 'name role');

  if (!pass) {
    res.status(404);
    throw new Error('Pass not found');
  }

  res.status(200).json({ success: true, pass });
});

// @desc    Get a pass by its QR token (used at scan time, and for the public pass view page)
// @route   GET /api/passes/token/:qrToken
// @access  Public
const getPassByToken = asyncHandler(async (req, res) => {
  const pass = await Pass.findOne({ qrToken: req.params.qrToken })
    .populate('visitor', 'name phone email photoUrl company purposeOfVisit');

  if (!pass) {
    res.status(404);
    throw new Error('Invalid pass token');
  }

  res.status(200).json({ success: true, pass });
});

// @desc    Revoke a pass
// @route   PATCH /api/passes/:id/revoke
// @access  Private (Frontdesk, Admin)
const revokePass = asyncHandler(async (req, res) => {
  const pass = await Pass.findById(req.params.id);

  if (!pass) {
    res.status(404);
    throw new Error('Pass not found');
  }

  pass.status = PASS_STATUS.REVOKED;
  await pass.save();

  res.status(200).json({ success: true, pass });
});

module.exports = {
  issuePass,
  getAllPasses,
  getPassById,
  getPassByToken,
  revokePass,
};