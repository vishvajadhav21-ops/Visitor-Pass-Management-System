const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no user found on request');
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied: role '${req.user.role}' is not permitted to access this resource`);
    }

    next();
  };
};

module.exports = checkRole;