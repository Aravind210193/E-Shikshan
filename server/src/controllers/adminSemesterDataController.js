const SemesterData = require('../models/SemesterData');

// Get all programs (Admin)
exports.getAllPrograms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    const query = search 
      ? { 
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { programKey: { $regex: search, $options: 'i' } }
          ]
        }
      : {};
    
    const programs = await SemesterData.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await SemesterData.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: programs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programs',
      error: error.message,
    });
  }
};

// Get program by ID (Admin)
exports.getProgramById = async (req, res) => {
  try {
    const program = await SemesterData.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching program',
      error: error.message,
    });
  }
};

// Create new program (Admin)
exports.createProgram = async (req, res) => {
  try {
    const { programKey, name, shortName, totalSemesters, color, description, semesters } = req.body;
    
    const existingProgram = await SemesterData.findOne({ programKey });
    if (existingProgram) {
      return res.status(400).json({
        success: false,
        message: 'Program with this key already exists',
      });
    }
    
    const program = await SemesterData.create({
      programKey,
      name,
      shortName,
      totalSemesters,
      color,
      description,
      semesters,
    });
    
    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating program',
      error: error.message,
    });
  }
};

// Update program (Admin)
exports.updateProgram = async (req, res) => {
  try {
    const { programKey, name, shortName, totalSemesters, color, description, semesters, isActive } = req.body;
    
    const program = await SemesterData.findByIdAndUpdate(
      req.params.id,
      { programKey, name, shortName, totalSemesters, color, description, semesters, isActive },
      { new: true, runValidators: true }
    );
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating program',
      error: error.message,
    });
  }
};

// Delete program (Admin)
exports.deleteProgram = async (req, res) => {
  try {
    const program = await SemesterData.findByIdAndDelete(req.params.id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting program',
      error: error.message,
    });
  }
};

// Update semester data in program (Admin)
exports.updateSemesterData = async (req, res) => {
  try {
    const { semesterNumber, semesterData } = req.body;
    
    const program = await SemesterData.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }
    
    if (!program.semesters) {
      program.semesters = {};
    }
    
    program.semesters[semesterNumber] = semesterData;
    program.markModified('semesters');
    await program.save();
    
    res.status(200).json({
      success: true,
      message: 'Semester data updated successfully',
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating semester data',
      error: error.message,
    });
  }
};
