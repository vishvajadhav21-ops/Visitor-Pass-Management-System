const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const Visitor = require('../models/Visitor.model');
const CheckLog = require('../models/CheckLog.model');
const Appointment = require('../models/Appointment.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Dashboard summary stats
// @route   GET /api/reports/summary
// @access  Private (Admin, Frontdesk)
const getSummary = asyncHandler(async (req, res) => {
  const totalVisitors = await Visitor.countDocuments();
  const totalAppointments = await Appointment.countDocuments();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysCheckIns = await CheckLog.countDocuments({
    action: 'in',
    timestamp: { $gte: today, $lt: tomorrow },
  });

  const currentlyInBuilding = await CheckLog.aggregate([
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$visitor', lastAction: { $first: '$action' } } },
    { $match: { lastAction: 'in' } },
    { $count: 'count' },
  ]);

  res.status(200).json({
    success: true,
    summary: {
      totalVisitors,
      totalAppointments,
      todaysCheckIns,
      currentlyInBuilding: currentlyInBuilding[0]?.count || 0,
    },
  });
});

// @desc    Visits grouped by day (for charts)
// @route   GET /api/reports/visits-by-day?from=&to=
// @access  Private
const getVisitsByDay = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const match = { action: 'in' };

  if (from || to) {
    match.timestamp = {};
    if (from) match.timestamp.$gte = new Date(from);
    if (to) match.timestamp.$lte = new Date(to);
  }

  const results = await CheckLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({ success: true, data: results });
});

// @desc    Export visitor list as CSV
// @route   GET /api/reports/export/csv?from=&to=
// @access  Private (Admin)
const exportVisitorsCSV = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = {};

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const visitors = await Visitor.find(filter)
    .populate('hostEmployee', 'name department')
    .lean();

  const rows = visitors.map((v) => ({
    Name: v.name,
    Phone: v.phone,
    Email: v.email || '',
    Company: v.company || '',
    Purpose: v.purposeOfVisit || '',
    Host: v.hostEmployee?.name || '',
    RegisteredAt: new Date(v.createdAt).toLocaleString(),
  }));

  const parser = new Parser();
  const csv = parser.parse(rows);

  res.header('Content-Type', 'text/csv');
  res.attachment('visitors_report.csv');
  res.send(csv);
});

// @desc    Export visitor list as Excel
// @route   GET /api/reports/export/excel?from=&to=
// @access  Private (Admin)
const exportVisitorsExcel = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = {};

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const visitors = await Visitor.find(filter)
    .populate('hostEmployee', 'name department')
    .lean();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Visitors');

  sheet.columns = [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Company', key: 'company', width: 20 },
    { header: 'Purpose', key: 'purpose', width: 20 },
    { header: 'Host', key: 'host', width: 20 },
    { header: 'Registered At', key: 'registeredAt', width: 20 },
  ];

  visitors.forEach((v) => {
    sheet.addRow({
      name: v.name,
      phone: v.phone,
      email: v.email || '',
      company: v.company || '',
      purpose: v.purposeOfVisit || '',
      host: v.hostEmployee?.name || '',
      registeredAt: new Date(v.createdAt).toLocaleString(),
    });
  });

  res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.attachment('visitors_report.xlsx');

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = {
  getSummary,
  getVisitsByDay,
  exportVisitorsCSV,
  exportVisitorsExcel,
};