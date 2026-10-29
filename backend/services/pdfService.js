const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Generates a PDF badge (with the QR code inside) and uploads it to Cloudinary
const generatePassPDF = async (pass, visitor) => {
  // Make the QR image in memory so it can be drawn inside the PDF
  const qrBuffer = await QRCode.toBuffer(pass.qrToken, { width: 300, margin: 1 });

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [300, 450], margin: 20 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(buffers);

          const uploadResult = await new Promise((res, rej) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'visitor-pass-system/badges',
                public_id: `badge_${pass.qrToken}`,
                resource_type: 'raw',
                format: 'pdf',
              },
              (error, result) => {
                if (error) rej(error);
                else res(result);
              }
            );
            Readable.from(pdfBuffer).pipe(uploadStream);
          });

          resolve(uploadResult.secure_url);
        } catch (err) {
          reject(err);
        }
      });

      // ---- PDF content ----
      doc.fontSize(18).text('Visitor Pass', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Name: ${visitor.name}`);
      doc.text(`Phone: ${visitor.phone}`);
      if (visitor.company) doc.text(`Company: ${visitor.company}`);
      doc.text(`Purpose: ${visitor.purposeOfVisit || 'N/A'}`);
      doc.moveDown();
      doc.text(`Valid From: ${new Date(pass.validFrom).toLocaleString()}`);
      doc.text(`Valid To: ${new Date(pass.validTo).toLocaleString()}`);
      doc.moveDown();

      // QR code, centered on the page
      const qrTop = doc.y;
      doc.image(qrBuffer, 75, qrTop, { width: 150 });
      doc.y = qrTop + 160;
      doc.fontSize(10).text('Scan QR at entry gate', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePassPDF };