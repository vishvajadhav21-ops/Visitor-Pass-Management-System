const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/verifyToken');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me
router.get('/me', verifyToken, getMe);

module.exports = router;