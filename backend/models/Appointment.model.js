const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../utils/constants');

const appointmentSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: [true, 'Visitor reference is required'],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // the employee being visited
      required: [true, 'Host employee is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // could be the host themself, frontdesk, or the visitor (if self-registering)
      required: true,
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of visit is required'],
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    scheduledTimeSlot: {
      type: String, // e.g. "10:00 AM - 11:00 AM"
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.PENDING,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);