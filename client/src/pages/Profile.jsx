import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI, enrollmentAPI, hackathonRegistrationAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Book,
  Award,
  Trophy,
  Bookmark,
  Star,
  BarChart2,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building,
  Code,
  Brain,
  Target,
  Loader,
  ArrowRight,
  Edit,
  MapPin,
  Briefcase,
  Languages,
  Globe,
  Check,
  Shield,
  GitBranch,
  BookOpen,
  Zap,
  TrendingUp,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  Medal
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [hackathonRegistrations, setHackathonRegistrations] = useState([]);
  const [savedResume, setSavedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const bannerInputRef = React.useRef(null);
  const profileInputRef = React.useRef(null);

  // Certificates state
  const [certificates, setCertificates] = useState([]);
  const [isAddCertificateModalOpen, setIsAddCertificateModalOpen] = useState(false);
  const [certificateFormData, setCertificateFormData] = useState({
    title: '',
    issuer: '',
    issuedDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    type: 'certificate',
    description: '',
    skills: '',
    imageUrl: '',
    pdfUrl: ''
  });
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  const certificateFileInputRef = React.useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view your profile');
          navigate('/login');
          return;
        }

        const profileResponse = await authAPI.getProfile();
        setUser(profileResponse.data);
        
          // Also update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(profileResponse.data));

        try {
          const coursesResponse = await enrollmentAPI.getMyCourses();
          setEnrolledCourses(coursesResponse.data || []);
        } catch (err) {
          console.warn('Could not fetch enrolled courses:', err);
          setEnrolledCourses([]);
        }

        try {
          const hackathonsResponse = await hackathonRegistrationAPI.getMyRegistrations();
          setHackathonRegistrations(hackathonsResponse.data.registrations || []);
        } catch (err) {
          console.warn('Could not fetch hackathon registrations:', err);
          setHackathonRegistrations([]);
        }

        try {
          const resumeResponse = await authAPI.getResume();
          setSavedResume(resumeResponse.data.resume || null);
        } catch (err) {
          console.warn('Could not fetch resume:', err);
          setSavedResume(null);
        }

        try {
          const certificatesResponse = await authAPI.getCertificates();
          setCertificates(certificatesResponse.data.certificates || []);
        } catch (err) {
          console.warn('Could not fetch certificates:', err);
          setCertificates([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          toast.error('Session expired. Please login again');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load profile data');
          toast.error('Failed to load profile data');
        }
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Auto-open edit modal if edit=true in URL
  useEffect(() => {
    if (searchParams.get('edit') === 'true' && user) {
      openEditModal();
    }
  }, [searchParams, user]);

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => course.progress?.overallProgress === 100).length;
  const ongoingCourses = totalCourses - completedCourses;
  const totalCertificates = certificates.length;

  const [activeTab, setActiveTab] = useState('overview');

  const openEditModal = () => {
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      university: user.university || '',
      department: user.department || '',
      semester: user.semester || '',
      bio: user.bio || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      website: user.website || '',
      degree: user.degree || '',
      yearOfStudy: user.yearOfStudy || '',
      graduationYear: user.graduationYear || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Include banner and profile images if they were changed
      const updatedData = {
        ...editFormData,
        ...(bannerImage && { bannerImage }),
        ...(profileImage && { profilePicture: profileImage })
      };
      
      const response = await authAPI.updateProfile(updatedData);
      
      // Update both user state and localStorage
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast.success('Profile updated successfully!');
      setIsEditModalOpen(false);
      
      // Don't clear the temporary image states - they'll show until page refresh
      // At which point the saved images from user.profilePicture and user.bannerImage will display
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result);
        toast.success('Banner image selected! Click Save to update.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success('Profile picture selected! Click Save to update.');
      };
      reader.readAsDataURL(file);
    }
  };

  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div
        className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  // Certificate handlers
  const handleAddCertificate = async (e) => {
    e.preventDefault();
    setIsUploadingCertificate(true);
    
    try {
      const skillsArray = certificateFormData.skills 
        ? certificateFormData.skills.split(',').map(s => s.trim()).filter(s => s)
        : [];
      
      const dataToSend = {
        ...certificateFormData,
        skills: skillsArray
      };
      
      const response = await authAPI.addCertificate(dataToSend);
      
      setCertificates([...certificates, response.data.certificate]);
      setIsAddCertificateModalOpen(false);
      resetCertificateForm();
      toast.success('Certificate added successfully!');
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast.error(error.response?.data?.message || 'Failed to add certificate');
    } finally {
      setIsUploadingCertificate(false);
    }
  };

  const handleCertificateFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileType = file.type;
    const isImage = fileType.startsWith('image/');
    const isPDF = fileType === 'application/pdf';
    
    if (!isImage && !isPDF) {
      toast.error('Please upload an image or PDF file');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      if (isImage) {
        setCertificateFormData(prev => ({ ...prev, imageUrl: base64String }));
      } else {
        setCertificateFormData(prev => ({ ...prev, pdfUrl: base64String }));
      }
      toast.success(`${isImage ? 'Image' : 'PDF'} uploaded successfully`);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }
    
    try {
      await authAPI.deleteCertificate(id);
      setCertificates(certificates.filter(cert => cert._id !== id));
      toast.success('Certificate deleted successfully');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error(error.response?.data?.message || 'Failed to delete certificate');
    }
  };

  const resetCertificateForm = () => {
    setCertificateFormData({
      title: '',
      issuer: '',
      issuedDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      type: 'certificate',
      description: '',
      skills: '',
      imageUrl: '',
      pdfUrl: ''
    });
    if (certificateFileInputRef.current) {
      certificateFileInputRef.current.value = '';
    }
  };

  const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      green: "bg-green-500/10 text-green-400 border-green-500/20",
      purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      orange: "bg-orange-500/10 text-orange-400 border-orange-500/20"
    };

    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-4">
          <div className={`${colorClasses[color]} rounded-lg p-3 border`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
            <p className="text-white text-2xl font-bold mt-1">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
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
          <span className="text-gray-400">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-red-500/30 rounded-xl p-8 max-w-md w-full">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Error Loading Profile</h2>
          </div>
          <p className="text-gray-400 mb-6 text-center">
            {error}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
            <Link 
              to="/" 
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-center transition-colors font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-6">Please login to view your profile</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition-colors font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Profile Banner */}
        <div className="relative bg-gray-800 rounded-2xl overflow-hidden mb-8 border border-gray-700 shadow-xl">
          {/* Profile Banner */}
          <div 
            className="h-48 relative overflow-hidden"
            style={{
              background: bannerImage || user.bannerImage 
                ? `url(${bannerImage || user.bannerImage}) center/cover` 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {!bannerImage && !user.bannerImage && (
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnptLTYtMmgtMlYwaDF2MzJoMXpNMjIgMzBoLTJWMGgydjMwem0tNCAwVjBoLTJ2MzBoMnptLTYgMGgtMlYwaDF2MzBoMXptLTYtMmgtMlYwaDF2MjhoMXptLTYtMmgtMlYwaDJ2MjZ6TTAgMjRoMnYySDAnIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            )}
            <div className="absolute bottom-0 right-0 p-4 flex gap-2">
              <button 
                onClick={() => bannerInputRef.current?.click()}
                className="bg-gray-900/70 hover:bg-gray-900 text-white text-xs py-2 px-4 rounded-lg flex items-center gap-2 backdrop-blur-sm border border-gray-700 transition-all font-medium">
                <Edit className="w-3 h-3" />
                Edit Banner
              </button>
              <button 
                onClick={openEditModal}
                className="bg-gray-900/70 hover:bg-gray-900 text-white text-xs py-2 px-4 rounded-lg flex items-center gap-2 backdrop-blur-sm border border-gray-700 transition-all font-medium">
                <Edit className="w-3 h-3" />
                Edit Profile
              </button>
            </div>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
            />
          </div>
          
          {/* Profile Info */}
          <div className="p-6 pt-0 relative">
            {/* Avatar with edit button overlay */}
            <div className="relative -mt-16 mb-4 inline-block">
              {profileImage || user.profilePicture ? (
                <img 
                  src={profileImage || user.profilePicture} 
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-900 shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-gray-900 shadow-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <button 
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full border-2 border-gray-900 transition-colors shadow-lg">
                <Edit className="w-4 h-4" />
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>
            
            {/* Profile completion indicator */}
            <div className="absolute top-6 right-6 bg-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-sm font-semibold text-gray-300">Profile Completion</div>
                <div className="text-blue-500 font-bold text-lg">85%</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: "85%" }}></div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {user.role === 'student' && (
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-500/30">Student</span>
                  )}
                  {user.role === 'faculty' && (
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-xs font-semibold border border-purple-500/30">Faculty</span>
                  )}
                  {user.role === 'admin' && (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-xs font-semibold border border-red-500/30">Admin</span>
                  )}
                </div>
                
                <p className="text-gray-400 mb-6 max-w-3xl leading-relaxed">
                  {user.bio || "Hi there! I'm a student passionate about learning new technologies and enhancing my skills through E-Shikshan. Currently focusing on web development and machine learning."}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span>Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    <span>{user.semester || "Not specified"} Semester</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-500" />
                    <span>{user.university || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-blue-500" />
                    <span>{user.department || "Not specified"}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 min-w-[140px]">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all font-medium shadow-lg shadow-blue-500/20">
                  Edit Profile
                </button>
                <Link to="/settings" className="w-full bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-all font-medium border border-gray-600 text-center">
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Book} label="Total Courses" value={totalCourses} color="blue" />
          <StatCard icon={Target} label="Completed Courses" value={completedCourses} color="green" />
          <StatCard icon={Award} label="Ongoing Courses" value={ongoingCourses} color="orange" />
          <StatCard icon={Trophy} label="Certificates" value={totalCertificates} color="purple" />
        </div>
        
        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Resume Builder */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all group shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Resume Builder</h3>
                <p className="text-gray-400 mb-4 text-sm">Create and update your professional resume with our AI-powered tools.</p>
                <Link to="/resume-building" className="inline-flex items-center text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors">
                  Build Resume <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Skill Assessment */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all group shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Skill Assessment</h3>
                <p className="text-gray-400 mb-4 text-sm">Take assessments to validate your skills and earn verified badges.</p>
                <Link to="/assessments" className="inline-flex items-center text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors">
                  Start Assessment <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Learning Paths */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all group shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Learning Paths</h3>
                <p className="text-gray-400 mb-4 text-sm">Follow structured learning paths to master new skills systematically.</p>
                <Link to="/roadmaps" className="inline-flex items-center text-green-400 text-sm font-semibold group-hover:text-green-300 transition-colors">
                  Explore Paths <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
          {/* Tabs */}
          <div className="border-b border-gray-700 p-4">
            <div className="flex flex-wrap gap-2">
              <TabButton id="overview" label="Overview" icon={BarChart2} />
              <TabButton id="personal" label="Personal Info" icon={User} />
              <TabButton id="courses" label="Enrolled Courses" icon={Book} />
              <TabButton id="hackathons" label="Hackathons" icon={Code} />
              <TabButton id="resume" label="My Resume" icon={FileText} />
              <TabButton id="achievements" label="Achievements" icon={Trophy} />
              <TabButton id="skills" label="Skills & Expertise" icon={Brain} />
              <TabButton id="bookmarks" label="Bookmarks" icon={Bookmark} />
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-4">
                      {enrolledCourses.slice(0, 5).map((enrollment, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{enrollment.courseId?.title || 'Course'}</h3>
                            <span className="text-sm text-gray-400">{enrollment.progress?.overallProgress || 0}%</span>
                          </div>
                          <ProgressBar value={enrollment.progress?.overallProgress || 0} />
                          <div className="mt-2 text-xs text-gray-500">
                            Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
                      <Book className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">No courses enrolled yet</p>
                      <Link to="/courses" className="text-blue-500 text-sm mt-2 inline-block hover:text-blue-400 font-medium">
                        Browse Courses →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Suggested Courses */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-xl p-5 border border-purple-500/30 hover:border-purple-500/50 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                          <BookOpen className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">Explore More Courses</h3>
                          <p className="text-sm text-gray-400 mb-3">
                            Discover courses in {user?.department || 'your field'} and expand your skills
                          </p>
                          <Link to="/courses" className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
                            Browse Courses →
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-5 border border-blue-500/30 hover:border-blue-500/50 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                          <Target className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">Learning Roadmaps</h3>
                          <p className="text-sm text-gray-400 mb-3">
                            Follow structured paths to master new technologies
                          </p>
                          <Link to="/roadmaps" className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
                            View Roadmaps →
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-5 border border-green-500/30 hover:border-green-500/50 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                          <Trophy className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">Join Hackathons</h3>
                          <p className="text-sm text-gray-400 mb-3">
                            Compete, learn, and showcase your skills
                          </p>
                          <Link to="/hackathons" className="text-green-400 text-sm font-semibold hover:text-green-300 transition-colors">
                            View Hackathons →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <>
                {enrolledCourses && enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((enrollment, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors">
                        <div className="mb-4">
                          <h3 className="font-semibold text-lg mb-2">{enrollment.courseId?.title || 'Course'}</h3>
                          <p className="text-sm text-gray-400">{enrollment.courseId?.category || 'General'}</p>
                        </div>
                        <ProgressBar value={enrollment.progress?.overallProgress || 0} />
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-400">
                            <div>Progress: {enrollment.progress?.overallProgress || 0}%</div>
                            <div className="text-xs mt-1">
                              {enrollment.paymentStatus === 'paid' ? (
                                <span className="text-green-400">✓ Paid</span>
                              ) : (
                                <span className="text-yellow-400">Free</span>
                              )}
                            </div>
                          </div>
                          <Link
                            to={`/courses`}
                            className="text-pink-500 hover:text-pink-400 text-sm font-medium"
                          >
                            Continue →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
                        <Book className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Courses Enrolled</h3>
                      <p className="text-gray-400 mb-6">You haven't enrolled in any courses yet. Start learning today!</p>
                      <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all font-medium shadow-lg shadow-blue-500/20"
                      >
                        Browse Courses <ArrowRight size={18} />
                      </Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'hackathons' && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">My Hackathons</h2>
                    <p className="text-gray-400">Track your hackathon registrations and submissions</p>
                  </div>

                  {hackathonRegistrations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {hackathonRegistrations.map((registration) => (
                        <motion.div
                          key={registration._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 hover:border-purple-500/50 transition-all group"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30 flex-shrink-0">
                              <Code className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white mb-1 truncate">
                                {registration.hackathonId?.title || 'Hackathon'}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                Team: {registration.teamName}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Team Size:</span>
                              <span className="text-white font-medium">{registration.teamSize} members</span>
                            </div>
                            {registration.projectTitle && (
                              <div className="flex items-start justify-between text-sm">
                                <span className="text-gray-400">Project:</span>
                                <span className="text-white font-medium text-right">{registration.projectTitle}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Status:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                registration.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                registration.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                registration.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Registered:</span>
                              <span className="text-white font-medium">
                                {new Date(registration.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {registration.techStack && registration.techStack.length > 0 && (
                            <div className="mb-4">
                              <p className="text-gray-400 text-xs mb-2">Tech Stack:</p>
                              <div className="flex flex-wrap gap-2">
                                {registration.techStack.slice(0, 3).map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-600"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {registration.techStack.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-600">
                                    +{registration.techStack.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Link
                              to={`/hackathon/${registration.hackathonId?._id}`}
                              className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                              View Details
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
                        <Code className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Hackathon Registrations</h3>
                      <p className="text-gray-400 mb-6">You haven't registered for any hackathons yet. Start participating today!</p>
                      <Link
                        to="/hackathons"
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-all font-medium shadow-lg shadow-purple-500/20"
                      >
                        <Code size={18} />
                        Browse Hackathons
                      </Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'resume' && (
                <>
                  {savedResume ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold">My Resume</h2>
                          <p className="text-gray-400 text-sm mt-1">
                            Last updated: {savedResume.lastUpdated ? new Date(savedResume.lastUpdated).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Link
                          to="/resume-building"
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all font-medium"
                        >
                          <Edit size={18} />
                          Edit Resume
                        </Link>
                      </div>

                      {/* Personal Info */}
                      {savedResume.personalInfo && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <User className="text-blue-400" size={20} />
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400 text-sm">Full Name</p>
                              <p className="text-white font-medium">{savedResume.personalInfo.fullName || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Email</p>
                              <p className="text-white font-medium">{savedResume.personalInfo.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Phone</p>
                              <p className="text-white font-medium">{savedResume.personalInfo.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Location</p>
                              <p className="text-white font-medium">{savedResume.personalInfo.location || 'N/A'}</p>
                            </div>
                            {savedResume.personalInfo.summary && (
                              <div className="md:col-span-2">
                                <p className="text-gray-400 text-sm">Professional Summary</p>
                                <p className="text-white">{savedResume.personalInfo.summary}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      {savedResume.experience && savedResume.experience.length > 0 && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Briefcase className="text-green-400" size={20} />
                            Work Experience
                          </h3>
                          <div className="space-y-4">
                            {savedResume.experience.map((exp, idx) => (
                              <div key={idx} className="border-l-2 border-blue-500 pl-4">
                                <h4 className="font-bold text-lg">{exp.position}</h4>
                                <p className="text-gray-400">{exp.company} • {exp.location}</p>
                                <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                                {exp.description && <p className="mt-2 text-gray-300">{exp.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {savedResume.education && savedResume.education.length > 0 && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <GraduationCap className="text-purple-400" size={20} />
                            Education
                          </h3>
                          <div className="space-y-4">
                            {savedResume.education.map((edu, idx) => (
                              <div key={idx} className="border-l-2 border-purple-500 pl-4">
                                <h4 className="font-bold text-lg">{edu.degree} in {edu.field}</h4>
                                <p className="text-gray-400">{edu.institution} • {edu.location}</p>
                                <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                                {edu.gpa && <p className="text-sm text-gray-400">GPA: {edu.gpa}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {savedResume.skills && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Code className="text-orange-400" size={20} />
                            Skills
                          </h3>
                          <div className="space-y-3">
                            {savedResume.skills.technical && savedResume.skills.technical.length > 0 && (
                              <div>
                                <p className="text-gray-400 text-sm mb-2">Technical Skills</p>
                                <div className="flex flex-wrap gap-2">
                                  {savedResume.skills.technical.map((skill, idx) => (
                                    <span key={idx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm border border-blue-500/30">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {savedResume.skills.tools && savedResume.skills.tools.length > 0 && (
                              <div>
                                <p className="text-gray-400 text-sm mb-2">Tools & Technologies</p>
                                <div className="flex flex-wrap gap-2">
                                  {savedResume.skills.tools.map((tool, idx) => (
                                    <span key={idx} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm border border-purple-500/30">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {savedResume.skills.languages && savedResume.skills.languages.length > 0 && (
                              <div>
                                <p className="text-gray-400 text-sm mb-2">Languages</p>
                                <div className="flex flex-wrap gap-2">
                                  {savedResume.skills.languages.map((lang, idx) => (
                                    <span key={idx} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm border border-green-500/30">
                                      {lang}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {savedResume.projects && savedResume.projects.length > 0 && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <GitBranch className="text-pink-400" size={20} />
                            Projects
                          </h3>
                          <div className="space-y-4">
                            {savedResume.projects.map((proj, idx) => (
                              <div key={idx} className="border-l-2 border-pink-500 pl-4">
                                <h4 className="font-bold text-lg">{proj.name}</h4>
                                <p className="text-gray-300 mt-1">{proj.description}</p>
                                {proj.technologies && <p className="text-sm text-gray-400 mt-1">Tech: {proj.technologies}</p>}
                                {proj.link && (
                                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm mt-1 inline-block">
                                    View Project →
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {savedResume.certifications && savedResume.certifications.length > 0 && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Award className="text-yellow-400" size={20} />
                            Certifications
                          </h3>
                          <div className="space-y-3">
                            {savedResume.certifications.map((cert, idx) => (
                              <div key={idx} className="flex items-start gap-3 bg-gray-700/50 p-3 rounded-lg">
                                <Award className="text-yellow-400 mt-1" size={18} />
                                <div>
                                  <h4 className="font-bold">{cert.name}</h4>
                                  <p className="text-gray-400 text-sm">{cert.issuer} • {cert.date}</p>
                                  {cert.credentialId && <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Resume Found</h3>
                      <p className="text-gray-400 mb-6">You haven't created your resume yet. Build your professional resume now!</p>
                      <Link
                        to="/resume-building"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all font-medium shadow-lg shadow-blue-500/20"
                      >
                        <FileText size={18} />
                        Build Resume
                      </Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  {/* Header with Add Button */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Certificates & Badges</h2>
                      <p className="text-gray-400">Your earned and uploaded certifications</p>
                    </div>
                    <button
                      onClick={() => setIsAddCertificateModalOpen(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                      Add Certificate
                    </button>
                  </div>

                  {/* Certificates Grid */}
                  {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {certificates.map((cert) => (
                        <motion.div
                          key={cert._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-800/60 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
                        >
                          {/* Certificate Image/Badge */}
                          {cert.imageUrl ? (
                            <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-gray-700/50">
                              <img 
                                src={cert.imageUrl} 
                                alt={cert.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-40 rounded-lg mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-gray-700">
                              <Medal className="w-16 h-16 text-blue-400" />
                            </div>
                          )}

                          {/* Certificate Info */}
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold text-lg leading-tight">{cert.title}</h3>
                              {cert.source === 'platform' && (
                                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" title="Platform Generated" />
                              )}
                            </div>
                            
                            {cert.issuer && (
                              <p className="text-sm text-gray-400">{cert.issuer}</p>
                            )}
                            
                            {cert.issuedDate && (
                              <p className="text-xs text-gray-500">
                                Issued: {new Date(cert.issuedDate).toLocaleDateString()}
                              </p>
                            )}
                            
                            {cert.credentialId && (
                              <p className="text-xs text-gray-500 font-mono">
                                ID: {cert.credentialId}
                              </p>
                            )}
                            
                            {cert.description && (
                              <p className="text-sm text-gray-400 line-clamp-2">{cert.description}</p>
                            )}
                            
                            {cert.skills && cert.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {cert.skills.slice(0, 3).map((skill, idx) => (
                                  <span key={idx} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                    {skill}
                                  </span>
                                ))}
                                {cert.skills.length > 3 && (
                                  <span className="text-xs text-gray-500">+{cert.skills.length - 3} more</span>
                                )}
                              </div>
                            )}
                            
                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              {cert.credentialUrl && (
                                <a
                                  href={cert.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
                                >
                                  <ExternalLink size={14} />
                                  Verify
                                </a>
                              )}
                              {cert.pdfUrl && (
                                <a
                                  href={cert.pdfUrl}
                                  download={`${cert.title}.pdf`}
                                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
                                >
                                  <Download size={14} />
                                  PDF
                                </a>
                              )}
                              {cert.source === 'manual' && (
                                <button
                                  onClick={() => handleDeleteCertificate(cert._id)}
                                  className="flex items-center justify-center gap-1 text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
                        <Award className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Certificates Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Complete courses to earn certificates or upload your external certifications!
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Link
                          to="/courses"
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all font-medium"
                        >
                          Browse Courses <ArrowRight size={18} />
                        </Link>
                        <button
                          onClick={() => setIsAddCertificateModalOpen(true)}
                          className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-all font-medium"
                        >
                          <Upload size={18} />
                          Upload Certificate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {activeTab === 'personal' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  <button className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                    <Edit size={14} />
                    Edit Information
                  </button>
                </div>
                
                {/* Basic Information */}
                <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold mb-6 text-blue-400 flex items-center gap-2">
                    <User size={20} />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <User size={14} />
                        Full Name
                      </div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Mail size={14} />
                        Email Address
                      </div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Phone size={14} />
                        Phone Number
                      </div>
                      <div className="font-medium">{user.phone || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Date of Birth
                      </div>
                      <div className="font-medium">
                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not provided"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <User size={14} />
                        Gender
                      </div>
                      <div className="font-medium">{user.gender || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <MapPin size={14} />
                        Address
                      </div>
                      <div className="font-medium">{user.address || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Phone size={14} />
                        Emergency Contact
                      </div>
                      <div className="font-medium">{user.emergencyContact || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Shield size={14} />
                        Blood Group
                      </div>
                      <div className="font-medium">{user.bloodGroup || "Not specified"}</div>
                    </div>
                  </div>
                </div>
                
                {/* Education Information */}
                <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold mb-6 text-green-400 flex items-center gap-2">
                    <GraduationCap size={20} />
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Building size={14} />
                        University/College
                      </div>
                      <div className="font-medium">{user.university || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Book size={14} />
                        Department/Major
                      </div>
                      <div className="font-medium">{user.department || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <GraduationCap size={14} />
                        Degree
                      </div>
                      <div className="font-medium">{user.degree || "Bachelor's Degree"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Current Semester
                      </div>
                      <div className="font-medium">{user.semester || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Year of Study
                      </div>
                      <div className="font-medium">{user.yearOfStudy || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Expected Graduation
                      </div>
                      <div className="font-medium">{user.graduationYear || "Not specified"}</div>
                    </div>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold mb-6 text-orange-400 flex items-center gap-2">
                    <Briefcase size={20} />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Current Position</div>
                      <div className="font-medium flex items-center gap-1">
                        <Briefcase size={14} className="text-gray-500" />
                        {user.currentPosition || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Company/Organization</div>
                      <div className="font-medium">{user.company || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Work Experience</div>
                      <div className="font-medium">{user.workExperience || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Industry</div>
                      <div className="font-medium">{user.industry || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Languages</div>
                      <div className="font-medium flex items-center gap-1">
                        <Languages size={14} className="text-gray-500" />
                        {user.languages || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Personal Website</div>
                      <div className="font-medium flex items-center gap-1">
                        <Globe size={14} className="text-gray-500" />
                        {user.website ? (
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">
                            {user.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          "Not specified"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account Information */}
                <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold mb-6 text-purple-400 flex items-center gap-2">
                    <Shield size={20} />
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Account Type</div>
                      <div className="font-medium capitalize">{user.role || "Student"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Joined</div>
                      <div className="font-medium">{new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Last Login</div>
                      <div className="font-medium">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "Not available"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Account Status</div>
                      <div className="font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Your Bookmarked Content</h2>
                
                {/* Tabs for bookmark categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20">All Items</button>
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors font-medium">Courses</button>
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors font-medium">Articles</button>
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors font-medium">Videos</button>
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors font-medium">Roadmaps</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Bookmark Cards - These would come from user's bookmarked content */}
                  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all">
                    <div className="h-32 bg-blue-600 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Book className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-blue-400 font-semibold">Course</span>
                        <button className="text-gray-400 hover:text-blue-400 transition-colors">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-1">React: From Zero to Expert</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">Learn React.js from scratch and build professional single-page applications.</p>
                      <Link to="/courses/react" className="text-blue-400 text-sm hover:text-blue-300 transition-colors font-medium">View Course →</Link>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all">
                    <div className="h-32 bg-purple-600 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-purple-400 font-semibold">Article</span>
                        <button className="text-gray-400 hover:text-purple-400 transition-colors">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-1">10 Advanced JavaScript Concepts</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">Master these advanced JavaScript concepts to take your development skills to the next level.</p>
                      <Link to="/articles/advanced-js" className="text-purple-400 text-sm hover:text-purple-300 transition-colors font-medium">Read Article →</Link>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500/50 transition-all">
                    <div className="h-32 bg-green-600 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Target className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-green-400 font-semibold">Roadmap</span>
                        <button className="text-gray-400 hover:text-green-400 transition-colors">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-1">Full-Stack Development Path</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">A comprehensive guide to becoming a full-stack developer with both frontend and backend skills.</p>
                      <Link to="/roadmaps/full-stack" className="text-green-400 text-sm hover:text-green-300 transition-colors font-medium">View Roadmap →</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-8">
                {/* Skill Assessment Summary */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Skill Assessment</h2>
                      <p className="text-gray-400 text-sm">Complete courses to develop and showcase your skills.</p>
                    </div>
                    <Link 
                      to="/courses"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-all whitespace-nowrap font-medium shadow-lg shadow-blue-500/20">
                      Browse Courses
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-700/50 rounded-lg p-5 text-center border border-gray-600">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{totalCourses}</div>
                      <div className="text-sm text-gray-400 font-medium">Enrolled Courses</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-5 text-center border border-gray-600">
                      <div className="text-3xl font-bold text-green-400 mb-2">{completedCourses}</div>
                      <div className="text-sm text-gray-400 font-medium">Completed</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-5 text-center border border-gray-600">
                      <div className="text-3xl font-bold text-orange-400 mb-2">{ongoingCourses}</div>
                      <div className="text-sm text-gray-400 font-medium">In Progress</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-5 text-center border border-gray-600">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{certificates}</div>
                      <div className="text-sm text-gray-400 font-medium">Certificates</div>
                    </div>
                  </div>
                </div>

                {/* Course-based Skills */}
                {enrolledCourses.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-pink-500" />
                      Skills from Your Courses
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enrolledCourses.map((enrollment, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{enrollment.courseId?.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              enrollment.progress?.overallProgress === 100 
                                ? 'bg-green-900/50 text-green-300' 
                                : 'bg-blue-900/50 text-blue-300'
                            }`}>
                              {enrollment.progress?.overallProgress === 100 ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {enrollment.courseId?.category || 'General'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {enrolledCourses.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
                      <Brain className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Start Building Your Skills</h3>
                    <p className="text-gray-400 mb-6">
                      Enroll in courses to develop new skills and enhance your profile
                    </p>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all font-medium shadow-lg shadow-blue-500/20"
                    >
                      Explore Courses <ArrowRight size={18} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Profile</h2>
                  <p className="text-blue-100 text-sm">Update your personal information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-400">
                    <User className="w-5 h-5" />
                    Basic Information
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editFormData.dateOfBirth}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={editFormData.website}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Education Information */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-400">
                    <GraduationCap className="w-5 h-5" />
                    Education Details
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">University/College</label>
                  <input
                    type="text"
                    name="university"
                    value={editFormData.university}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your institution name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Department/Branch</label>
                  <input
                    type="text"
                    name="department"
                    value={editFormData.department}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={editFormData.degree}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., B.Tech, M.Sc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={editFormData.semester}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5th, 7th"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year of Study</label>
                  <select
                    name="yearOfStudy"
                    value={editFormData.yearOfStudy}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                    <option value="5th">5th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expected Graduation Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={editFormData.graduationYear}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2025"
                    min="2020"
                    max="2035"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleEditChange}
                    rows="4"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself, your interests, and goals..."
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditChange}
                    rows="2"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Your current address"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-900/50 p-6 flex justify-end gap-3 border-t border-gray-700">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Certificate Modal */}
      {isAddCertificateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Certificate or Badge</h2>
              <button
                onClick={() => {
                  setIsAddCertificateModalOpen(false);
                  resetCertificateForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCertificate} className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                <input
                  ref={certificateFileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleCertificateFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => certificateFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Upload size={18} />
                  Upload Image or PDF
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  {certificateFormData.imageUrl ? '✓ Image uploaded' : 
                   certificateFormData.pdfUrl ? '✓ PDF uploaded' : 
                   'Supports JPG, PNG, PDF'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Certificate Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={certificateFormData.title}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={certificateFormData.type}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="certificate">Certificate</option>
                    <option value="badge">Badge</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>

                {/* Issuer */}
                <div>
                  <label className="block text-sm font-medium mb-2">Issuing Organization</label>
                  <input
                    type="text"
                    value={certificateFormData.issuer}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Amazon Web Services"
                  />
                </div>

                {/* Issue Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={certificateFormData.issuedDate}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, issuedDate: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={certificateFormData.expiryDate}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Credential ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">Credential ID</label>
                  <input
                    type="text"
                    value={certificateFormData.credentialId}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, credentialId: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., ABC123XYZ"
                  />
                </div>

                {/* Verification URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">Verification URL</label>
                  <input
                    type="url"
                    value={certificateFormData.credentialUrl}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, credentialUrl: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={certificateFormData.description}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Brief description of what this certification covers..."
                  />
                </div>

                {/* Skills */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={certificateFormData.skills}
                    onChange={(e) => setCertificateFormData(prev => ({ ...prev, skills: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., AWS, Cloud Computing, DevOps"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCertificateModalOpen(false);
                    resetCertificateForm();
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
                  disabled={isUploadingCertificate}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingCertificate || !certificateFormData.title}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploadingCertificate ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Certificate
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;