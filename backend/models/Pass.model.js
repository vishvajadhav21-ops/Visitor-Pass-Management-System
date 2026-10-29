const mongoose = require('mongoose');
const { PASS_STATUS } = require('../utils/constants');

const passSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: [true, 'Visitor reference is required'],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null, // null for walk-in passes issued without a prior appointment
    },
    qrToken: {
      type: String,
      required: true,
      unique: true, // the unique string encoded into the QR code
    },
    qrCodeUrl: {
      type: String, // Cloudinary/local URL of the generated QR image
      default: null,
    },
    pdfUrl: {
      type: String, // Cloudinary/local URL of the generated PDF badge
      default: null,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PASS_STATUS),
      default: PASS_STATUS.ACTIVE,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // frontdesk/admin who issued it
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pass', passSchema);