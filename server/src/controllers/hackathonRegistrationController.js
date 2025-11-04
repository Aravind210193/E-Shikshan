const HackathonRegistration = require('../models/HackathonRegistration');
const AdminHackathon = require('../models/AdminHackathon');
const User = require('../models/User');

// Register for a hackathon
exports.register = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user._id;
    
    const {
      teamName,
      teamSize,
      teamMembers,
      projectTitle,
      projectDescription,
      techStack,
      githubUrl,
      portfolioUrl,
      experience,
      motivation,
      phone,
    } = req.body;

    // Check if hackathon exists
    const hackathon = await AdminHackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    console.log('[Registration] Hackathon found:', hackathon.title, hackathon._id.toString());

    // Load full user details to populate required fields
    const user = await User.findById(userId).select('name email phone');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('[Registration] Loaded user for registration:', {
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    // Check if user already registered
    const existingRegistration = await HackathonRegistration.findOne({
      userId,
      hackathonId,
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this hackathon' });
    }

    // Create registration
    const registration = await HackathonRegistration.create({
      userId,
      hackathonId,
      userDetails: {
        name: user.name,
        email: user.email,
        phone: phone || user.phone,
      },
      teamName,
      teamSize,
      teamMembers: teamMembers || [],
      projectTitle,
      projectDescription,
      techStack: techStack || [],
      githubUrl,
      portfolioUrl,
      experience,
      motivation,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for hackathon',
      registration,
    });
  } catch (err) {
    console.error('Hackathon registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.fromEntries(
          Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
        ),
      });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user's hackathon registrations
exports.getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const registrations = await HackathonRegistration.find({ userId })
      .populate('hackathonId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      registrations,
    });
  } catch (err) {
    console.error('Get registrations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is registered for a hackathon
exports.checkRegistration = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user._id;

    const registration = await HackathonRegistration.findOne({
      userId,
      hackathonId,
    });

    res.json({
      success: true,
      isRegistered: !!registration,
      registration: registration || null,
    });
  } catch (err) {
    console.error('Check registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user._id;

    const registration = await HackathonRegistration.findOneAndDelete({
      userId,
      hackathonId,
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (err) {
    console.error('Cancel registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
