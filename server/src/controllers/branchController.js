const Branch = require('../models/Branch');

// Get all branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true }).sort({ title: 1 });
    
    res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching branches',
      error: error.message,
    });
  }
};

// Get branch by ID
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

// Get branch by title
exports.getBranchByTitle = async (req, res) => {
  try {
    const branch = await Branch.findOne({ title: req.params.title, isActive: true });
    
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
