const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        university: user.university,
        department: user.department,
        semester: user.semester,
        role: user.role,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
        bannerImage: user.bannerImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password, phone, university, department, semester, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create a new user instance with all available fields
    const user = new User({
      name,
      email,
      password,
      phone: phone || '',
      university: university || '',
      department: department || '',
      semester: semester || '',
      role: role || 'student',
    });

    // Explicitly save the user to trigger the 'pre-save' hook
    const createdUser = await user.save();

    if (createdUser) {
      res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        phone: createdUser.phone,
        university: createdUser.university,
        department: createdUser.department,
        semester: createdUser.semester,
        role: createdUser.role,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    console.log('=== GET PROFILE CALLED ===');
    console.log('req.user:', JSON.stringify(req.user, null, 2));
    console.log('Looking for user with ID:', req.user._id);
    
    const user = await User.findById(req.user._id).select('-password');
    
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (user) {
      console.log('Returning user:', user.email);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        university: user.university,
        department: user.department,
        semester: user.semester,
        role: user.role,
        isAdmin: user.isAdmin,
        joinedDate: user.joinedDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Additional profile fields
        bio: user.bio,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        emergencyContact: user.emergencyContact,
        bloodGroup: user.bloodGroup,
        degree: user.degree,
        yearOfStudy: user.yearOfStudy,
        graduationYear: user.graduationYear,
        currentPosition: user.currentPosition,
        company: user.company,
        workExperience: user.workExperience,
        industry: user.industry,
        languages: user.languages,
        website: user.website,
        profilePicture: user.profilePicture,
        bannerImage: user.bannerImage
      });
    } else {
      console.log('❌ User not found for ID:', req.user._id);
      console.log('Token user object:', req.user);
      res.status(404).json({ 
        message: 'User not found',
        debug: {
          tokenUserId: req.user._id,
          tokenData: req.user
        }
      });
    }
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update basic fields
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.university = req.body.university !== undefined ? req.body.university : user.university;
      user.department = req.body.department !== undefined ? req.body.department : user.department;
      user.semester = req.body.semester !== undefined ? req.body.semester : user.semester;
      
      // Update additional profile fields
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.address = req.body.address !== undefined ? req.body.address : user.address;
      user.dateOfBirth = req.body.dateOfBirth !== undefined ? req.body.dateOfBirth : user.dateOfBirth;
      user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
      user.emergencyContact = req.body.emergencyContact !== undefined ? req.body.emergencyContact : user.emergencyContact;
      user.bloodGroup = req.body.bloodGroup !== undefined ? req.body.bloodGroup : user.bloodGroup;
      user.degree = req.body.degree !== undefined ? req.body.degree : user.degree;
      user.yearOfStudy = req.body.yearOfStudy !== undefined ? req.body.yearOfStudy : user.yearOfStudy;
      user.graduationYear = req.body.graduationYear !== undefined ? req.body.graduationYear : user.graduationYear;
      user.currentPosition = req.body.currentPosition !== undefined ? req.body.currentPosition : user.currentPosition;
      user.company = req.body.company !== undefined ? req.body.company : user.company;
      user.workExperience = req.body.workExperience !== undefined ? req.body.workExperience : user.workExperience;
      user.industry = req.body.industry !== undefined ? req.body.industry : user.industry;
      user.languages = req.body.languages !== undefined ? req.body.languages : user.languages;
      user.website = req.body.website !== undefined ? req.body.website : user.website;
      user.profilePicture = req.body.profilePicture !== undefined ? req.body.profilePicture : user.profilePicture;
      user.bannerImage = req.body.bannerImage !== undefined ? req.body.bannerImage : user.bannerImage;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        university: updatedUser.university,
        department: updatedUser.department,
        semester: updatedUser.semester,
        role: updatedUser.role,
        isAdmin: updatedUser.isAdmin,
        bio: updatedUser.bio,
        address: updatedUser.address,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        emergencyContact: updatedUser.emergencyContact,
        bloodGroup: updatedUser.bloodGroup,
        degree: updatedUser.degree,
        yearOfStudy: updatedUser.yearOfStudy,
        graduationYear: updatedUser.graduationYear,
        currentPosition: updatedUser.currentPosition,
        company: updatedUser.company,
        workExperience: updatedUser.workExperience,
        industry: updatedUser.industry,
        languages: updatedUser.languages,
        website: updatedUser.website,
        profilePicture: updatedUser.profilePicture,
        bannerImage: updatedUser.bannerImage,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Save/Update user resume
// @route   PUT /api/auth/resume
// @access  Private
const saveResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update resume data
    user.resume = {
      ...req.body,
      lastUpdated: Date.now()
    };

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Resume saved successfully',
      resume: updatedUser.resume
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ message: 'Server error saving resume' });
  }
};

// @desc    Get user resume
// @route   GET /api/auth/resume
// @access  Private
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('resume');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      resume: user.resume || null
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error fetching resume' });
  }
};

module.exports = { login, register, getProfile, updateProfile, saveResume, getResume };
