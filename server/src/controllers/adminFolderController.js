const Folder = require('../models/Folder');

// Get all folders (Admin)
exports.getAllFolders = async (req, res) => {
  try {
    const { page = 1, limit = 10, branch, subject, sortBy = 'branch', sortOrder = 'asc' } = req.query;
    
    const query = {};
    if (branch) query.branch = { $regex: branch, $options: 'i' };
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    
    const folders = await Folder.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Folder.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: folders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching folders',
      error: error.message,
    });
  }
};

// Get folder by ID (Admin)
exports.getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    
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

// Create new folder (Admin)
exports.createFolder = async (req, res) => {
  try {
    const { branch, subject, units } = req.body;
    
    const existingFolder = await Folder.findOne({ branch, subject });
    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: 'Folder for this branch and subject already exists',
      });
    }
    
    const folder = await Folder.create({
      branch,
      subject,
      units,
    });
    
    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating folder',
      error: error.message,
    });
  }
};

// Update folder (Admin)
exports.updateFolder = async (req, res) => {
  try {
    const { branch, subject, units, isActive } = req.body;
    
    const folder = await Folder.findByIdAndUpdate(
      req.params.id,
      { branch, subject, units, isActive },
      { new: true, runValidators: true }
    );
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Folder updated successfully',
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating folder',
      error: error.message,
    });
  }
};

// Delete folder (Admin)
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findByIdAndDelete(req.params.id);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Folder deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting folder',
      error: error.message,
    });
  }
};

// Add unit to folder (Admin)
exports.addUnitToFolder = async (req, res) => {
  try {
    const { title, link } = req.body;
    
    const folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }
    
    folder.units.push({ title, link });
    await folder.save();
    
    res.status(200).json({
      success: true,
      message: 'Unit added successfully',
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding unit',
      error: error.message,
    });
  }
};

// Remove unit from folder (Admin)
exports.removeUnitFromFolder = async (req, res) => {
  try {
    const { unitId } = req.params;
    
    const folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }
    
    folder.units = folder.units.filter(u => u._id.toString() !== unitId);
    await folder.save();
    
    res.status(200).json({
      success: true,
      message: 'Unit removed successfully',
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing unit',
      error: error.message,
    });
  }
};

// Update unit in folder (Admin)
exports.updateUnitInFolder = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { title, link } = req.body;
    
    const folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }
    
    const unit = folder.units.id(unitId);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
    }
    
    unit.title = title || unit.title;
    unit.link = link || unit.link;
    await folder.save();
    
    res.status(200).json({
      success: true,
      message: 'Unit updated successfully',
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating unit',
      error: error.message,
    });
  }
};
