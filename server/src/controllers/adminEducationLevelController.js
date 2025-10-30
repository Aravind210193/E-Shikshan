const EducationLevel = require('../models/EducationLevel');

// Get all education levels (Admin)
exports.getAllEducationLevels = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'level', sortOrder = 'asc' } = req.query;
    
    const query = search 
      ? { level: { $regex: search, $options: 'i' } }
      : {};
    
    const levels = await EducationLevel.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await EducationLevel.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: levels,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching education levels',
      error: error.message,
    });
  }
};

// Get education level by ID (Admin)
exports.getEducationLevelById = async (req, res) => {
  try {
    const level = await EducationLevel.findById(req.params.id);
    
    if (!level) {
      return res.status(404).json({
        success: false,
        message: 'Education level not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: level,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching education level',
      error: error.message,
    });
  }
};

// Create new education level (Admin)
exports.createEducationLevel = async (req, res) => {
  try {
    const { level, description, branches } = req.body;
    
    const existingLevel = await EducationLevel.findOne({ level });
    if (existingLevel) {
      return res.status(400).json({
        success: false,
        message: 'Education level already exists',
      });
    }
    
    const educationLevel = await EducationLevel.create({
      level,
      description,
      branches,
    });
    
    res.status(201).json({
      success: true,
      message: 'Education level created successfully',
      data: educationLevel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating education level',
      error: error.message,
    });
  }
};

// Update education level (Admin)
exports.updateEducationLevel = async (req, res) => {
  try {
    const { level, description, branches, isActive } = req.body;
    
    const educationLevel = await EducationLevel.findByIdAndUpdate(
      req.params.id,
      { level, description, branches, isActive },
      { new: true, runValidators: true }
    );
    
    if (!educationLevel) {
      return res.status(404).json({
        success: false,
        message: 'Education level not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Education level updated successfully',
      data: educationLevel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating education level',
      error: error.message,
    });
  }
};

// Delete education level (Admin)
exports.deleteEducationLevel = async (req, res) => {
  try {
    const level = await EducationLevel.findByIdAndDelete(req.params.id);
    
    if (!level) {
      return res.status(404).json({
        success: false,
        message: 'Education level not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Education level deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting education level',
      error: error.message,
    });
  }
};

// Add branch to education level (Admin)
exports.addBranchToLevel = async (req, res) => {
  try {
    const { title, link } = req.body;
    
    const level = await EducationLevel.findById(req.params.id);
    
    if (!level) {
      return res.status(404).json({
        success: false,
        message: 'Education level not found',
      });
    }
    
    level.branches.push({ title, link });
    await level.save();
    
    res.status(200).json({
      success: true,
      message: 'Branch added successfully',
      data: level,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding branch',
      error: error.message,
    });
  }
};

// Remove branch from education level (Admin)
exports.removeBranchFromLevel = async (req, res) => {
  try {
    const { branchId } = req.params;
    
    const level = await EducationLevel.findById(req.params.id);
    
    if (!level) {
      return res.status(404).json({
        success: false,
        message: 'Education level not found',
      });
    }
    
    level.branches = level.branches.filter(b => b._id.toString() !== branchId);
    await level.save();
    
    res.status(200).json({
      success: true,
      message: 'Branch removed successfully',
      data: level,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing branch',
      error: error.message,
    });
  }
};
