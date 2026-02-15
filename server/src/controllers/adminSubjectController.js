const Subject = require('../models/Subject');

// Get all subjects (Admin)
exports.getAllSubjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, branch, semester, sortBy = 'branch', sortOrder = 'asc' } = req.query;
    
    const query = {};
    if (branch) query.branch = { $regex: branch, $options: 'i' };
    if (semester) query.semester = { $regex: semester, $options: 'i' };
    
    const subjects = await Subject.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Subject.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: subjects,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message,
    });
  }
};

// Get subject by ID (Admin)
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subject',
      error: error.message,
    });
  }
};

// Create new subject group (Admin)
exports.createSubject = async (req, res) => {
  try {
    const { branch, semester, subjects } = req.body;
    
    const existingSubject = await Subject.findOne({ branch, semester });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject group for this branch and semester already exists',
      });
    }
    
    const subjectGroup = await Subject.create({
      branch,
      semester,
      subjects,
    });
    
    res.status(201).json({
      success: true,
      message: 'Subject group created successfully',
      data: subjectGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subject group',
      error: error.message,
    });
  }
};

// Update subject group (Admin)
exports.updateSubject = async (req, res) => {
  try {
    const { branch, semester, subjects, isActive } = req.body;
    
    const subjectGroup = await Subject.findByIdAndUpdate(
      req.params.id,
      { branch, semester, subjects, isActive },
      { new: true, runValidators: true }
    );
    
    if (!subjectGroup) {
      return res.status(404).json({
        success: false,
        message: 'Subject group not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Subject group updated successfully',
      data: subjectGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subject group',
      error: error.message,
    });
  }
};

// Delete subject group (Admin)
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject group not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Subject group deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subject group',
      error: error.message,
    });
  }
};

// Add subject to group (Admin)
exports.addSubjectToGroup = async (req, res) => {
  try {
    const { title, link } = req.body;
    
    const subjectGroup = await Subject.findById(req.params.id);
    
    if (!subjectGroup) {
      return res.status(404).json({
        success: false,
        message: 'Subject group not found',
      });
    }
    
    subjectGroup.subjects.push({ title, link });
    await subjectGroup.save();
    
    res.status(200).json({
      success: true,
      message: 'Subject added successfully',
      data: subjectGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding subject',
      error: error.message,
    });
  }
};

// Remove subject from group (Admin)
exports.removeSubjectFromGroup = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const subjectGroup = await Subject.findById(req.params.id);
    
    if (!subjectGroup) {
      return res.status(404).json({
        success: false,
        message: 'Subject group not found',
      });
    }
    
    subjectGroup.subjects = subjectGroup.subjects.filter(s => s._id.toString() !== subjectId);
    await subjectGroup.save();
    
    res.status(200).json({
      success: true,
      message: 'Subject removed successfully',
      data: subjectGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing subject',
      error: error.message,
    });
  }
};
