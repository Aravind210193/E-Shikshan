const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Admin login attempt:', { email, password: '***' });

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('❌ Admin not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✅ Admin found:', admin.email);

    // Check if admin is active
    if (!admin.isActive) {
      console.log('❌ Admin account deactivated');
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    console.log('✅ Admin is active');

    // Verify password
    console.log('🔑 Comparing passwords...');
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('🔑 Password match result:', isMatch);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✅ Password verified');

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json({ success: true, admin });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register new admin (super admin only)
// @route   POST /api/admin/auth/register
// @access  Private (Super Admin)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'course_manager',
      permissions: permissions || ['courses'],
    });

    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Logout admin
// @route   POST /api/admin/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
