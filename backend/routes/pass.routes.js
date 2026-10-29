const express = require('express');
const router = express.Router();

const {
  issuePass,
  getAllPasses,
  getPassById,
  getPassByToken,
  revokePass,
} = require('../controllers/pass.controller');

const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { ROLES } = require('../utils/constants');

// Public route — visitor views their own pass via QR token link, no login required
router.get('/token/:qrToken', getPassByToken);

// All routes below require login
router.use(verifyToken);

router.post(
  '/',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK),
  issuePass
);

router.get(
  '/',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK),
  getAllPasses
);

router.get(
  '/:id',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK),
  getPassById
);

router.patch(
  '/:id/revoke',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK),
  revokePass
);

module.exports = router;