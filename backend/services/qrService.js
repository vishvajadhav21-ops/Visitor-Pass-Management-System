const QRCode = require('qrcode');
const cloudinary = require('../config/cloudinary');

// Generates a QR code image (as base64) and uploads it to Cloudinary, returns the hosted URL
const generateQRCode = async (token) => {
  try {
    // Generate QR as a base64 data URL
    const qrDataUrl = await QRCode.toDataURL(token, {
      width: 400,
      margin: 2,
    });

    // Upload the base64 image directly to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(qrDataUrl, {
      folder: 'visitor-pass-system/qrcodes',
      public_id: `qr_${token}`,
    });

    return uploadResult.secure_url;
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
};

module.exports = { generateQRCode };