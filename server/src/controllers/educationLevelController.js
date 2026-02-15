const EducationLevel = require('../models/EducationLevel');

// Get all education levels
exports.getAllEducationLevels = async (req, res) => {
  try {
    const levels = await EducationLevel.find({ isActive: true }).sort({ level: 1 });
    
    res.status(200).json({
      success: true,
      count: levels.length,
      data: levels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching education levels',
      error: error.message,
    });
  }
};

// Get education level by ID
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

// Get education level by level name
exports.getEducationLevelByName = async (req, res) => {
  try {
    const level = await EducationLevel.findOne({ level: req.params.level, isActive: true });
    
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
