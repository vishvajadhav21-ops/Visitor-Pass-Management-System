const Appointment = require('../models/Appointment.model');
const asyncHandler = require('../utils/asyncHandler');
const { APPOINTMENT_STATUS, ROLES } = require('../utils/constants');
const { sendEmail } = require('../services/emailService');
const Visitor = require('../models/Visitor.model');
const User = require('../models/User.model');

// @desc    Create a new appointment / pre-registration invite
// @route   POST /api/appointments
// @access  Private (Employee, Frontdesk, Admin)
const createAppointment = asyncHandler(async (req, res) => {
  const { visitor, host, purpose, scheduledDate, scheduledTimeSlot, notes } = req.body;

  const appointment = await Appointment.create({
    visitor,
    host,
    createdBy: req.user.id,
    purpose,
    scheduledDate,
    scheduledTimeSlot,
    notes,
  });

  // Notify the host that a new appointment needs their approval
  const visitorDoc = await Visitor.findById(visitor);
  const hostDoc = await User.findById(host);

  if (hostDoc?.email) {
    await sendEmail({
      to: hostDoc.email,
      subject: 'New Visitor Appointment Request',
      templateName: 'appointmentInvite.html',
      data: {
        hostName: hostDoc.name,
        visitorName: visitorDoc?.name || 'Unknown',
        purpose,
        scheduledDate: new Date(scheduledDate).toLocaleDateString(),
        scheduledTimeSlot: scheduledTimeSlot || 'N/A',
      },
    });
  }

  // NOTE: this is where we'll later call notificationService to email/SMS the host
  // e.g. await sendEmail(hostEmail, 'appointmentInvite', {...})

  res.status(201).json({ success: true, appointment });
});

// @desc    Get all appointments (filter by host, status, date range)
// @route   GET /api/appointments?host=&status=&from=&to=
// @access  Private
const getAllAppointments = asyncHandler(async (req, res) => {
  const { host, status, from, to } = req.query;
  const filter = {};

  if (host) filter.host = host;
  if (status) filter.status = status;
  if (from || to) {
    filter.scheduledDate = {};
    if (from) filter.scheduledDate.$gte = new Date(from);
    if (to) filter.scheduledDate.$lte = new Date(to);
  }

  const appointments = await Appointment.find(filter)
    .populate('visitor', 'name phone email company')
    .populate('host', 'name email department')
    .populate('createdBy', 'name role')
    .sort({ scheduledDate: -1 });

  res.status(200).json({ success: true, count: appointments.length, appointments });
});

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('visitor')
    .populate('host', 'name email department')
    .populate('createdBy', 'name role');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  res.status(200).json({ success: true, appointment });
});

// @desc    Get appointments for the logged-in visitor (matched by email)
// @route   GET /api/appointments/my
// @access  Private (Visitor)
const getMyAppointments = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Find Visitor records matching this user's email
  const visitorRecords = await Visitor.find({ email: user.email });
  const visitorIds = visitorRecords.map((v) => v._id);

  const appointments = await Appointment.find({ visitor: { $in: visitorIds } })
    .populate('visitor', 'name phone email company')
    .populate('host', 'name email department')
    .sort({ scheduledDate: -1 });

  res.status(200).json({ success: true, count: appointments.length, appointments });
});

// @desc    Approve an appointment
// @route   PATCH /api/appointments/:id/approve
// @access  Private (Employee/host, Admin)
const approveAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('visitor');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = APPOINTMENT_STATUS.APPROVED;
  appointment.approvedBy = req.user.id;
  appointment.approvedAt = new Date();

  await appointment.save();

  // Notify the visitor their appointment was approved (if they have an email)
  if (appointment.visitor?.email) {
    await sendEmail({
      to: appointment.visitor.email,
      subject: 'Your Appointment Has Been Approved',
      templateName: 'appointmentInvite.html', // reuse or create a dedicated "approved" template later
      data: {
        hostName: 'Our team',
        visitorName: appointment.visitor.name,
        purpose: appointment.purpose,
        scheduledDate: new Date(appointment.scheduledDate).toLocaleDateString(),
        scheduledTimeSlot: appointment.scheduledTimeSlot || 'N/A',
      },
    });
  }



  // NOTE: this is where we'll trigger pass generation + notify visitor
  // e.g. await createPassForAppointment(appointment)

  res.status(200).json({ success: true, appointment });
});


// @desc    Visitor requests their own appointment
// @route   POST /api/appointments/request
// @access  Private (Visitor)
const requestAppointment = asyncHandler(async (req, res) => {
  const { host, purpose, scheduledDate, scheduledTimeSlot, notes, phone } = req.body;

  const user = await User.findById(req.user.id);

  // Find or create a matching Visitor record for this logged-in visitor
  let visitorDoc = await Visitor.findOne({ email: user.email });
  if (!visitorDoc) {
    if (!phone) {
      res.status(400);
      throw new Error('Phone number is required for your first appointment request');
    }
    visitorDoc = await Visitor.create({
      name: user.name,
      email: user.email,
      phone,
      registeredBy: req.user.id,
    });
  }

  const appointment = await Appointment.create({
    visitor: visitorDoc._id,
    host,
    createdBy: req.user.id,
    purpose,
    scheduledDate,
    scheduledTimeSlot,
    notes,
  });

  const hostDoc = await User.findById(host);
  if (hostDoc?.email) {
    await sendEmail({
      to: hostDoc.email,
      subject: 'New Visitor Appointment Request',
      templateName: 'appointmentInvite.html',
      data: {
        hostName: hostDoc.name,
        visitorName: visitorDoc.name,
        purpose,
        scheduledDate: new Date(scheduledDate).toLocaleDateString(),
        scheduledTimeSlot: scheduledTimeSlot || 'N/A',
      },
    });
  }

  res.status(201).json({ success: true, appointment });
});


// @desc    Reject an appointment
// @route   PATCH /api/appointments/:id/reject
// @access  Private (Employee/host, Admin)
const rejectAppointment = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = APPOINTMENT_STATUS.REJECTED;
  appointment.rejectionReason = rejectionReason || 'No reason provided';

  await appointment.save();

  res.status(200).json({ success: true, appointment });
});

// @desc    Cancel an appointment
// @route   PATCH /api/appointments/:id/cancel
// @access  Private (staff, or the visitor who owns it)
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('visitor');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // If the requester is a visitor, verify they own this appointment
  if (req.user.role === ROLES.VISITOR) {
    const user = await User.findById(req.user.id);
    if (appointment.visitor?.email !== user.email) {
      res.status(403);
      throw new Error('You can only cancel your own appointments');
    }
  }

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  await appointment.save();

  res.status(200).json({ success: true, appointment });
});

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getMyAppointments,
  approveAppointment,
  rejectAppointment,
  cancelAppointment,
  requestAppointment
};