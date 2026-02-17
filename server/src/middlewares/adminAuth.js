const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Admin not found or inactive' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // Super admin or full permission
    if (req.admin.role === 'admin' || req.admin.permissions.includes('all')) {
      return next();
    }

    // Explicit role checks mapping
    if (requiredPermission === 'resumes' && req.admin.role === 'resume_instructor') {
      return next();
    }

    if (!req.admin.permissions.includes(requiredPermission)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = { adminAuth, checkPermission };
