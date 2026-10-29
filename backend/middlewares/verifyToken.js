const jwt = require('jsonwebtoken');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');

const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // decoded = { id, role, iat, exp }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

module.exports = verifyToken;