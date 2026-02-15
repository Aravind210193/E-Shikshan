const Subject = require('../models/Subject');

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const { branch, semester } = req.query;
    const filter = { isActive: true };
    
    if (branch) filter.branch = branch;
    if (semester) filter.semester = semester;
    
    const subjects = await Subject.find(filter).sort({ branch: 1, semester: 1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message,
    });
  }
};

// Get subjects by branch
exports.getSubjectsByBranch = async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      branch: req.params.branch, 
      isActive: true 
    }).sort({ semester: 1 });
    
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No subjects found for this branch',
      });
    }
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message,
    });
  }
};

// Get subjects by branch and semester
exports.getSubjectsByBranchAndSemester = async (req, res) => {
  try {
    const { branch, semester } = req.params;
    
    const subjectGroup = await Subject.findOne({ 
      branch, 
      semester, 
      isActive: true 
    });
    
    if (!subjectGroup) {
      return res.status(404).json({
        success: false,
        message: 'No subjects found for this branch and semester',
      });
    }
    
    res.status(200).json({
      success: true,
      data: subjectGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message,
    });
  }
};
