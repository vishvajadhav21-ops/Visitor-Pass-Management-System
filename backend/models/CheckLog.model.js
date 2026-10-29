const mongoose = require('mongoose');
const { CHECK_ACTION } = require('../utils/constants');

const checkLogSchema = new mongoose.Schema(
  {
    pass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pass',
      required: [true, 'Pass reference is required'],
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: [true, 'Visitor reference is required'],
    },
    action: {
      type: String,
      enum: Object.values(CHECK_ACTION),
      required: true,
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // frontdesk staff who scanned the QR
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String, // e.g. "Main Gate", "Reception Floor 2" — useful for multi-entry buildings
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CheckLog', checkLogSchema);