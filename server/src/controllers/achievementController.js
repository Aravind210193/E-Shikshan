const Achievement = require('../models/Achievement');

// @desc    Get all achievements for a user
// @route   GET /api/achievements
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user.id });
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get certificates for a user
// @route   GET /api/achievements/certificates
// @access  Private
const getUserCertificates = async (req, res) => {
  try {
    const certificates = await Achievement.find({
      user: req.user.id,
      type: 'certificate'
    });
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new achievement
// @route   POST /api/achievements
// @access  Private (Admin only)
const createAchievement = async (req, res) => {
  try {
    const { userId, title, description, type, date, image, metadata } = req.body;

    // Create new achievement
    const achievement = new Achievement({
      user: userId,
      title,
      description,
      type,
      date: date || Date.now(),
      image,
      metadata
    });

    const savedAchievement = await achievement.save();
    res.status(201).json(savedAchievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Admin only)
const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Achievement removed' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting achievement',
      error: error.message
    });
  }
};

module.exports = {
  getUserAchievements,
  getUserCertificates,
  createAchievement,
  deleteAchievement
};