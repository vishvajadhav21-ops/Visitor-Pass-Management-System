const express = require('express');
const router = express.Router();

const {
  registerVisitor,
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
} = require('../controllers/visitor.controller');

const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const upload = require('../middlewares/upload');
const { ROLES } = require('../utils/constants');

// All routes require login
router.use(verifyToken);

// Frontdesk, Employee, Admin can register + view visitors
router.post(
  '/',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK, ROLES.EMPLOYEE),
  upload.single('photo'),
  registerVisitor
);

router.get(
  '/',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK, ROLES.EMPLOYEE),
  getAllVisitors
);

router.get(
  '/:id',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK, ROLES.EMPLOYEE),
  getVisitorById
);

router.put(
  '/:id',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK),
  upload.single('photo'),
  updateVisitor
);

router.delete(
  '/:id',
  checkRole(ROLES.ADMIN),
  deleteVisitor
);

module.exports = router;