const SemesterData = require('../models/SemesterData');

// Get all programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await SemesterData.find({ isActive: true }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programs',
      error: error.message,
    });
  }
};

// Get program by programKey
exports.getProgramByKey = async (req, res) => {
  try {
    const program = await SemesterData.findOne({ 
      programKey: req.params.programKey, 
      isActive: true 
    });
    
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

// Get specific semester data from a program
exports.getSemesterData = async (req, res) => {
  try {
    const { programKey, semesterNumber } = req.params;
    
    const program = await SemesterData.findOne({ 
      programKey, 
      isActive: true 
    });
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }
    
    const semesterData = program.semesters.get(semesterNumber);
    
    if (!semesterData) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        programKey: program.programKey,
        programName: program.name,
        semester: semesterNumber,
        semesterData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching semester data',
      error: error.message,
    });
  }
};
