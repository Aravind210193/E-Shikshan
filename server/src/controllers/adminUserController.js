const AdminUser = require('../models/AdminUser');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private
exports.getAllUsers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const users = await AdminUser.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await AdminUser.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await AdminUser.create({
      name,
      email,
      role: role || 'Student',
      status: status || 'Active',
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await AdminUser.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and already exists
    if (email !== user.email) {
      const existingUser = await AdminUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private
exports.deleteUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const total = await AdminUser.countDocuments();
    const active = await AdminUser.countDocuments({ status: 'Active' });
    const pending = await AdminUser.countDocuments({ status: 'Pending' });
    const inactive = await AdminUser.countDocuments({ status: 'Inactive' });

    res.json({
      success: true,
      stats: { total, active, pending, inactive },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
