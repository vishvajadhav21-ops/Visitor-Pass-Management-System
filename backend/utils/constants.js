const ROLES = {
  ADMIN: 'admin',
  FRONTDESK: 'frontdesk',
  EMPLOYEE: 'employee',
  VISITOR: 'visitor',
};

const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

const PASS_STATUS = {
  ACTIVE: 'active',
  USED: 'used',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
};

const CHECK_ACTION = {
  IN: 'in',
  OUT: 'out',
};

module.exports = {
  ROLES,
  APPOINTMENT_STATUS,
  PASS_STATUS,
  CHECK_ACTION,
};