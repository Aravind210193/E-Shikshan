import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Globe,
  Eye,
  EyeOff,
  Save,
  Camera,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Languages,
  Loader,
  Check,
  X
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: ''
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    currentPosition: '',
    company: '',
    workExperience: '',
    industry: '',
    languages: '',
    website: '',
    skills: '',
    linkedin: '',
    github: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    assignmentReminders: true,
    newsAndUpdates: false,
    weeklyDigest: true
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await authAPI.getProfile();
      const userData = response.data;

      setPersonalInfo({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        address: userData.address || '',
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        gender: userData.gender || '',
        bloodGroup: userData.bloodGroup || '',
        emergencyContact: userData.emergencyContact || ''
      });

      setProfessionalInfo({
        currentPosition: userData.currentPosition || '',
        company: userData.company || '',
        workExperience: userData.workExperience || '',
        industry: userData.industry || '',
        languages: userData.languages || '',
        website: userData.website || '',
        skills: userData.skills || '',
        linkedin: userData.linkedin || '',
        github: userData.github || ''
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to load settings');
      }
      setLoading(false);
    }
  };

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleProfessionalInfoChange = (e) => {
    setProfessionalInfo({
      ...professionalInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
  };

  const savePersonalInfo = async () => {
    try {
      setSaving(true);
      await authAPI.updateProfile(personalInfo);
      toast.success('Personal information updated successfully!');
    } catch (error) {
      console.error('Error updating personal info:', error);
      toast.error('Failed to update personal information');
    } finally {
      setSaving(false);
    }
  };

  const saveProfessionalInfo = async () => {
    try {
      setSaving(true);
      await authAPI.updateProfile(professionalInfo);
      toast.success('Professional information updated successfully!');
    } catch (error) {
      console.error('Error updating professional info:', error);
      toast.error('Failed to update professional information');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      // Assuming you have a password change endpoint
      await authAPI.updateProfile({ 
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword 
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-gray-400">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
          {/* Tabs */}
          <div className="border-b border-gray-700 p-4">
            <div className="flex flex-wrap gap-2">
              <TabButton id="personal" label="Personal Info" icon={User} />
              <TabButton id="professional" label="Professional" icon={Briefcase} />
              <TabButton id="security" label="Security" icon={Shield} />
              <TabButton id="notifications" label="Notifications" icon={Bell} />
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                  <p className="text-gray-400 mb-6">Update your personal details and contact information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <User className="w-4 h-4 text-blue-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="your.email@example.com"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 text-blue-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={personalInfo.dateOfBirth}
                      onChange={handlePersonalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <User className="w-4 h-4 text-blue-400" />
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={personalInfo.gender}
                      onChange={handlePersonalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={personalInfo.bloodGroup}
                      onChange={handlePersonalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 text-blue-400" />
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={personalInfo.emergencyContact}
                      onChange={handlePersonalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={personalInfo.bio}
                    onChange={handlePersonalInfoChange}
                    rows="4"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={savePersonalInfo}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Professional Info Tab */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Professional Information</h2>
                  <p className="text-gray-400 mb-6">Update your professional details and work experience</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      Current Position
                    </label>
                    <input
                      type="text"
                      name="currentPosition"
                      value={professionalInfo.currentPosition}
                      onChange={handleProfessionalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Building className="w-4 h-4 text-blue-400" />
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={professionalInfo.company}
                      onChange={handleProfessionalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g., Tech Corp"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      Work Experience
                    </label>
                    <input
                      type="text"
                      name="workExperience"
                      value={professionalInfo.workExperience}
                      onChange={handleProfessionalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g., 2 years"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={professionalInfo.industry}
                      onChange={handleProfessionalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g., Information Technology"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Languages className="w-4 h-4 text-blue-400" />
                      Languages
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={professionalInfo.languages}
                      onChange={handleProfessionalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g., English, Spanish, Hindi"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Personal Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={professionalInfo.website}
                      onChange={handleProfessionalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={professionalInfo.linkedin}
                      onChange={handleProfessionalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={professionalInfo.github}
                      onChange={handleProfessionalInfoChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills</label>
                  <textarea
                    name="skills"
                    value={professionalInfo.skills}
                    onChange={handleProfessionalInfoChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g., JavaScript, React, Node.js, Python, Machine Learning"
                  />
                  <p className="text-sm text-gray-400 mt-1">Separate skills with commas</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveProfessionalInfo}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Security Settings</h2>
                  <p className="text-gray-400 mb-6">Manage your password and security preferences</p>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={changePassword}
                      disabled={saving}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader className="w-5 h-5 animate-spin" />
                          Changing Password...
                        </span>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                  <p className="text-gray-400 mb-6">Manage how you receive notifications</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('emailNotifications')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          notificationSettings.emailNotifications ? 'translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Course Updates</h3>
                      <p className="text-sm text-gray-400">Get notified about new course content</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('courseUpdates')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notificationSettings.courseUpdates ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          notificationSettings.courseUpdates ? 'translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Assignment Reminders</h3>
                      <p className="text-sm text-gray-400">Receive reminders for upcoming assignments</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('assignmentReminders')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notificationSettings.assignmentReminders ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          notificationSettings.assignmentReminders ? 'translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">News and Updates</h3>
                      <p className="text-sm text-gray-400">Stay informed about platform updates</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('newsAndUpdates')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notificationSettings.newsAndUpdates ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          notificationSettings.newsAndUpdates ? 'translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Weekly Digest</h3>
                      <p className="text-sm text-gray-400">Get a weekly summary of your activity</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('weeklyDigest')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notificationSettings.weeklyDigest ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          notificationSettings.weeklyDigest ? 'translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
