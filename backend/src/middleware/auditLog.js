const AuditLog = require('../models/AuditLog');

const auditLog = (action) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        
        await AuditLog.create({
          userId: req.user.id,
          action: action,
          resource: `${req.method} ${req.originalUrl}`,
          ipAddress: ipAddress
        });
      }
    } catch (error) {
      console.error('Audit log error:', error);
    }
    next();
  };
};

module.exports = auditLog;
