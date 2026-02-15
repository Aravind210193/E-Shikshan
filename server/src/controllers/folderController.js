const Folder = require('../models/Folder');

// Get all folders
exports.getAllFolders = async (req, res) => {
  try {
    const { branch, subject } = req.query;
    const filter = { isActive: true };
    
    if (branch) filter.branch = branch;
    if (subject) filter.subject = subject;
    
    const folders = await Folder.find(filter).sort({ branch: 1, subject: 1 });
    
    res.status(200).json({
      success: true,
      count: folders.length,
      data: folders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching folders',
      error: error.message,
    });
  }
};

// Get folders by branch
exports.getFoldersByBranch = async (req, res) => {
  try {
    const folders = await Folder.find({ 
      branch: req.params.branch, 
      isActive: true 
    }).sort({ subject: 1 });
    
    if (!folders || folders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No folders found for this branch',
      });
    }
    
    res.status(200).json({
      success: true,
      count: folders.length,
      data: folders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching folders',
      error: error.message,
    });
  }
};

// Get folder by branch and subject
exports.getFolderByBranchAndSubject = async (req, res) => {
  try {
    const { branch, subject } = req.params;
    
    const folder = await Folder.findOne({ 
      branch, 
      subject, 
      isActive: true 
    });
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching folder',
      error: error.message,
    });
  }
};
