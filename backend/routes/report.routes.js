const express = require('express');
const router = express.Router();

const {
  getSummary,
  getVisitsByDay,
  exportVisitorsCSV,
  exportVisitorsExcel,
} = require('../controllers/report.controller');

const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { ROLES } = require('../utils/constants');

// All routes require login + admin/frontdesk access
router.use(verifyToken, checkRole(ROLES.ADMIN, ROLES.FRONTDESK));

router.get('/summary', getSummary);
router.get('/visits-by-day', getVisitsByDay);
router.get('/export/csv', exportVisitorsCSV);
router.get('/export/excel', exportVisitorsExcel);

module.exports = router;