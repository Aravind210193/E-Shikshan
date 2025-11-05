const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  university: { type: String },
  department: { type: String },
  semester: { type: String },
  joinedDate: { type: Date, default: Date.now },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  isAdmin: { type: Boolean, required: true, default: false },
  
  // Enrolled Courses Array (for quick access check)
  enrolledCourses: [{
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course' 
    },
    enrollmentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Enrollment' 
    },
    enrolledAt: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      enum: ['active', 'completed', 'suspended'],
      default: 'active'
    }
  }],
  
  // Additional profile fields
  bio: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  emergencyContact: { type: String },
  bloodGroup: { type: String },
  degree: { type: String },
  yearOfStudy: { type: String },
  graduationYear: { type: String },
  currentPosition: { type: String },
  company: { type: String },
  workExperience: { type: String },
  industry: { type: String },
  languages: { type: String },
  website: { type: String },
  profilePicture: { type: String },
  bannerImage: { type: String },
  // Resume Data
  resume: {
    personalInfo: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      location: { type: String },
      linkedin: { type: String },
      github: { type: String },
      portfolio: { type: String },
      summary: { type: String }
    },
    experience: [{
      company: { type: String },
      position: { type: String },
      location: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      current: { type: Boolean },
      description: { type: String }
    }],
    education: [{
      institution: { type: String },
      degree: { type: String },
      field: { type: String },
      location: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      gpa: { type: String },
      description: { type: String }
    }],
    skills: {
      technical: [{ type: String }],
      languages: [{ type: String }],
      tools: [{ type: String }]
    },
    projects: [{
      name: { type: String },
      description: { type: String },
      technologies: { type: String },
      link: { type: String }
    }],
    certifications: [{
      name: { type: String },
      issuer: { type: String },
      date: { type: String },
      credentialId: { type: String }
    }],
    template: {
      selectedTemplate: { type: String },
      selectedSubTemplate: { type: String }
    },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
