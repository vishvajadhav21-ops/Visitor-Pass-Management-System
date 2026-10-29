const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getHostsList
} = require('../controllers/user.controller');

const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { ROLES } = require('../utils/constants');

// Every route below requires login — but NOT necessarily admin
router.use(verifyToken);

// Any logged-in user (including visitor) can see the host list
router.get('/hosts', getHostsList);

// Everything below THIS point requires admin specifically
router.use(checkRole(ROLES.ADMIN));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;