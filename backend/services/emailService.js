const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false, // true for port 465, false for 587
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

// Loads an HTML template and replaces {{placeholders}} with real data
const renderTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, '..', 'templates', templateName);
  let html = fs.readFileSync(templatePath, 'utf-8');

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key] ?? '');
  });

  return html;
};

// data.templateName must match a file in /templates, e.g. 'appointmentInvite.html'
const sendEmail = async ({ to, subject, templateName, data }) => {
  try {
    const html = renderTemplate(templateName, data);

    await transporter.sendMail({
      from: `"Visitor Pass System" <${env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    // Don't crash the main request if email fails — just log it
    console.error(`❌ Failed to send email to ${to}: ${error.message}`);
  }
};

module.exports = { sendEmail };