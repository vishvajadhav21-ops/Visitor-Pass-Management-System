const CheckLog = require('../models/CheckLog.model');
const Pass = require('../models/Pass.model');
const asyncHandler = require('../utils/asyncHandler');
const { PASS_STATUS, CHECK_ACTION } = require('../utils/constants');
const { sendEmail } = require('../services/emailService');

// @desc    Scan a QR code to check a visitor in or out
// @route   POST /api/checklogs/scan
// @access  Private (Frontdesk, Admin)
const scanPass = asyncHandler(async (req, res) => {
  const { qrToken, action, location } = req.body; // action: 'in' | 'out'

  const pass = await Pass.findOne({ qrToken }).populate('visitor');

  if (!pass) {
    res.status(404);
    throw new Error('Invalid QR code — pass not found');
  }

  if (pass.status === PASS_STATUS.REVOKED) {
    res.status(400);
    throw new Error('This pass has been revoked');
  }

  const now = new Date();
  if (now < pass.validFrom || now > pass.validTo) {
    res.status(400);
    throw new Error('This pass is not valid at this time (expired or not yet active)');
  }

  if (action === CHECK_ACTION.IN) {
    // Prevent double check-in without a check-out in between
    const lastLog = await CheckLog.findOne({ pass: pass._id }).sort({ timestamp: -1 });
    if (lastLog && lastLog.action === CHECK_ACTION.IN) {
      res.status(400);
      throw new Error('Visitor is already checked in');
    }
  }

  if (action === CHECK_ACTION.OUT) {
    const lastLog = await CheckLog.findOne({ pass: pass._id }).sort({ timestamp: -1 });
    if (!lastLog || lastLog.action === CHECK_ACTION.OUT) {
      res.status(400);
      throw new Error('Visitor has not checked in yet');
    }
  }

  const checkLog = await CheckLog.create({
    pass: pass._id,
    visitor: pass.visitor._id,
    action,
    scannedBy: req.user.id,
    location: location || null,
    timestamp: now,
  });

  // Mark pass as used once checked out (optional business rule — adjust as needed)
  if (action === CHECK_ACTION.OUT) {
    pass.status = PASS_STATUS.USED;
    await pass.save();
  }

  // Notify the host their visitor has arrived (only on check-in)
  if (action === CHECK_ACTION.IN) {
    const host = pass.appointment?.host;
    if (host?.email) {
      await sendEmail({
        to: host.email,
        subject: 'Your Visitor Has Arrived',
        templateName: 'checkInAlert.html',
        data: {
          hostName: host.name,
          visitorName: pass.visitor.name,
          location: location || 'Main Gate',
          timestamp: now.toLocaleString(),
        },
      });
    }
  }

  res.status(201).json({
    success: true,
    message: `Visitor checked ${action} successfully`,
    checkLog,
    visitor: pass.visitor,
  });
});

// @desc    Get all check logs (filter by visitor, date range, action)
// @route   GET /api/checklogs?visitor=&action=&from=&to=
// @access  Private
const getAllCheckLogs = asyncHandler(async (req, res) => {
  const { visitor, action, from, to } = req.query;
  const filter = {};

  if (visitor) filter.visitor = visitor;
  if (action) filter.action = action;
  if (from || to) {
    filter.timestamp = {};
    if (from) filter.timestamp.$gte = new Date(from);
    if (to) filter.timestamp.$lte = new Date(to);
  }

  const logs = await CheckLog.find(filter)
    .populate('visitor', 'name phone photoUrl')
    .populate('scannedBy', 'name role')
    .populate('pass', 'qrToken status')
    .sort({ timestamp: -1 });

  res.status(200).json({ success: true, count: logs.length, logs });
});

// @desc    Get check-in/out history for a specific pass
// @route   GET /api/checklogs/pass/:passId
// @access  Private
const getLogsByPass = asyncHandler(async (req, res) => {
  const logs = await CheckLog.find({ pass: req.params.passId })
    .populate('scannedBy', 'name role')
    .sort({ timestamp: 1 });

  res.status(200).json({ success: true, count: logs.length, logs });
});

module.exports = { scanPass, getAllCheckLogs, getLogsByPass };