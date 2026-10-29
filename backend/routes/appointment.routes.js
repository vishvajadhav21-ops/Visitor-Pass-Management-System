const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  approveAppointment,
  rejectAppointment,
  cancelAppointment,
  getMyAppointments,
  requestAppointment
} = require('../controllers/appointment.controller');

const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { ROLES } = require('../utils/constants');

router.use(verifyToken);

router.get('/my', getMyAppointments);

router.post('/request', checkRole(ROLES.VISITOR), requestAppointment);

router.post('/', checkRole(ROLES.ADMIN, ROLES.FRONTDESK, ROLES.EMPLOYEE), createAppointment);

router.get('/', checkRole(ROLES.ADMIN, ROLES.FRONTDESK, ROLES.EMPLOYEE), getAllAppointments);

router.get('/:id', checkRole(ROLES.ADMIN, ROLES.FRONTDESK, ROLES.EMPLOYEE), getAppointmentById);

router.patch(
  '/:id/cancel',
  checkRole(ROLES.ADMIN, ROLES.FRONTDESK, ROLES.EMPLOYEE, ROLES.VISITOR),
  cancelAppointment
);

router.patch(
  '/:id/reject',
  checkRole(ROLES.ADMIN, ROLES.EMPLOYEE),
  rejectAppointment
);

router.patch(
  '/:id/approve',
  checkRole(ROLES.ADMIN, ROLES.EMPLOYEE),
  approveAppointment
);
module.exports = router;