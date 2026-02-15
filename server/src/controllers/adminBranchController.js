const Branch = require('../models/Branch');

// Get all branches (Admin)
exports.getAllBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'title', sortOrder = 'asc' } = req.query;
    
    const query = search 
      ? { title: { $regex: search, $options: 'i' } }
      : {};
    
    const branches = await Branch.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Branch.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: branches,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching branches',
      error: error.message,
    });
  }
};

// Get branch by ID (Admin)
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching branch',
      error: error.message,
    });
  }
};

// Create new branch (Admin)
exports.createBranch = async (req, res) => {
  try {
    const { title, link, description } = req.body;
    
    // Check if branch already exists
    const existingBranch = await Branch.findOne({ title });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'Branch with this title already exists',
      });
    }
    
    const branch = await Branch.create({
      title,
      link,
      description,
    });
    
    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating branch',
      error: error.message,
    });
  }
};

// Update branch (Admin)
exports.updateBranch = async (req, res) => {
  try {
    const { title, link, description, isActive } = req.body;
    
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { title, link, description, isActive },
      { new: true, runValidators: true }
    );
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating branch',
      error: error.message,
    });
  }
};

// Delete branch (Admin)
exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Branch deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting branch',
      error: error.message,
    });
  }
};

// Toggle branch active status (Admin)
exports.toggleBranchStatus = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }
    
    branch.isActive = !branch.isActive;
    await branch.save();
    
    res.status(200).json({
      success: true,
      message: `Branch ${branch.isActive ? 'activated' : 'deactivated'} successfully`,
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling branch status',
      error: error.message,
    });
  }
};
