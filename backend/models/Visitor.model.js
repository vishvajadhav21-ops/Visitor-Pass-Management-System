const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    idProofType: {
      type: String, // e.g. "Aadhar", "Passport", "Driving License"
      trim: true,
    },
    idProofNumber: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String, // path/URL to uploaded photo
      default: null,
    },
    purposeOfVisit: {
      type: String,
      trim: true,
    },
    hostEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // the employee/host they're visiting
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // frontdesk staff who registered them, if applicable
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visitor', visitorSchema);