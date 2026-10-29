const express = require('express');
const router = express.Router();

const {
  scanPass,
  getAllCheckLogs,
  getLogsByPass,
} = require('../controllers/checklog.controller');

const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { ROLES } = require('../utils/constants');

// All routes require login
router.use(verifyToken);

router.post(
  '/scan',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK),
  scanPass
);

router.get(
  '/',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK),
  getAllCheckLogs
);

router.get(
  '/pass/:passId',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK),
  getLogsByPass
);

module.exports = router;