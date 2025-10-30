const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware to protect routes - verifies JWT token
const protect = async (req, res, next) => {
  console.log('=== Protect Middleware Called ===');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  
  // Get token from header
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);
  
  const token = authHeader?.replace('Bearer ', '');
  console.log('Extracted Token:', token ? 'Token exists' : 'No token');

  // Check if no token
  if (!token) {
    console.log('ERROR: No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    // Add user from payload with both id and _id for compatibility
    req.user = { ...decoded, id: decoded.id, _id: decoded.id };
    console.log('req.user set:', req.user);
    console.log('Authenticated user ID:', req.user.id);
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
const adminOnly = async (req, res, next) => {
  console.log('=== Admin Only Middleware Called ===');
  
  if (!req.user) {
    console.log('ERROR: No user in request');
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Check if user is admin by looking up in Admin model
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      console.log('ERROR: User is not an admin');
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    if (!admin.isActive) {
      console.log('ERROR: Admin account is inactive');
      return res.status(403).json({ 
        message: 'Admin account is inactive' 
      });
    }

    // Add admin info to request
    req.admin = admin;
    console.log('Admin verified:', admin.username);
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ message: 'Error verifying admin status' });
  }
};

module.exports = { protect, adminOnly };
