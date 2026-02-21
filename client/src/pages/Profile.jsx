import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI, enrollmentAPI, hackathonRegistrationAPI, coursesAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Book,
  Award,
  Trophy,
  Bookmark,
  Star,
  BarChart2,
  FileText,
  Users,
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
  Medal,
  Layout,
  CheckCircle,
  Fingerprint,
  ChevronDown,
  Menu,
  X,
  Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const [recommendations, setRecommendations] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfContainerRef = React.useRef(null);

  const downloadCertificatesAsPDF = async (certList, title = 'Certificates') => {
    if (certList.length === 0) {
      toast.error('No certificates to download');
      return;
    }

    setIsGeneratingPDF(true);
    const toastId = toast.loading('Generating your certificate portfolio...');

    try {
      // Create a temporary container for PDF generation
      const printableArea = document.createElement('div');
      printableArea.style.position = 'fixed';
      printableArea.style.top = '-10000px';
      printableArea.style.left = '0';
      printableArea.style.width = '210mm'; // A4 width
      printableArea.style.padding = '20mm';
      printableArea.style.backgroundColor = '#0f172a'; // Deep slate background to match theme
      printableArea.style.color = '#ffffff';
      printableArea.style.fontFamily = 'Arial, sans-serif';
      printableArea.id = 'temp-pdf-area';

      // Header
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 28px; font-weight: 900; margin: 0; color: #3b82f6;">E-SHIKSHAN</h1>
          <p style="font-size: 14px; font-weight: 700; color: #94a3b8; margin-top: 5px;">CERTIFICATE PORTFOLIO: ${title.toUpperCase()}</p>
          <p style="font-size: 12px; color: #64748b;">Generated for ${user.name} on ${new Date().toLocaleDateString()}</p>
        </div>
      `;
      printableArea.appendChild(header);

      // Certificate List
      const listContainer = document.createElement('div');
      listContainer.style.display = 'flex';
      listContainer.style.flexDirection = 'column';
      listContainer.style.gap = '30px';

      for (const cert of certList) {
        const certItem = document.createElement('div');
        certItem.style.backgroundColor = '#1e293b';
        certItem.style.borderRadius = '20px';
        certItem.style.padding = '25px';
        certItem.style.border = '1px solid #334155';
        certItem.style.pageBreakInside = 'avoid'; // Prevent breaking a single cert across pages

        certItem.innerHTML = `
          <div style="display: flex; gap: 25px; align-items: center;">
            <div style="width: 120px; height: 90px; background: linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; border: 1px solid #475569;">
              ${cert.imageUrl
            ? `<img src="${cert.imageUrl}" style="width: 100%; height: 100%; object-cover: cover;" crossorigin="anonymous"/>`
            : `<div style="color: #60a5fa; font-size: 24px; font-weight: 900;">★</div>`
          }
            </div>
            <div style="flex: 1;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 900; color: #ffffff;">${cert.title}</h3>
              <p style="margin: 5px 0 0; font-size: 14px; font-weight: 700; color: #3b82f6;">Issued by ${cert.issuer || 'Academic Institution'}</p>
              <div style="display: flex; gap: 15px; margin-top: 10px;">
                <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 800;">Date: ${new Date(cert.issuedDate).toLocaleDateString()}</p>
                <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 800;">Source: ${cert.source === 'platform' ? 'Verified' : 'Private Repository'}</p>
              </div>
            </div>
          </div>
        `;
        listContainer.appendChild(certItem);
      }
      printableArea.appendChild(listContainer);

      // Footer
      const footer = document.createElement('div');
      footer.style.marginTop = '40px';
      footer.style.textAlign = 'center';
      footer.style.borderTop = '1px solid #334155';
      footer.style.paddingTop = '15px';
      footer.innerHTML = `<p style="font-size: 10px; color: #475569;">This is an auto-generated certificate summary from E-Shikshan Platform.</p>`;
      printableArea.appendChild(footer);

      document.body.appendChild(printableArea);

      const canvas = await html2canvas(printableArea, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f172a',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.removeChild(printableArea);
      toast.success('Certificate portfolio downloaded successfully', { id: toastId });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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

        // Parallel fetch for other data
        const [coursesRes, hackathonsRes, resumeRes, certificatesRes, allCoursesRes] = await Promise.allSettled([
          enrollmentAPI.getMyCourses(),
          hackathonRegistrationAPI.getMyRegistrations(),
          authAPI.getResume(),
          authAPI.getCertificates(),
          coursesAPI.getAll({ limit: 5 })
        ]);

        const myCourses = coursesRes.status === 'fulfilled' ? (Array.isArray(coursesRes.value.data) ? coursesRes.value.data : []) : [];
        setEnrolledCourses(myCourses);

        if (hackathonsRes.status === 'fulfilled') {
          const hData = hackathonsRes.value.data;
          setHackathonRegistrations(Array.isArray(hData.registrations) ? hData.registrations : []);
        }

        if (resumeRes.status === 'fulfilled') setSavedResume(resumeRes.value.data.resume || null);

        if (certificatesRes.status === 'fulfilled') {
          const cData = certificatesRes.value.data;
          setCertificates(Array.isArray(cData.certificates) ? cData.certificates : []);
        }

        // Build recommendations from all courses
        if (allCoursesRes.status === 'fulfilled') {
          const allCourses = Array.isArray(allCoursesRes.value.data.courses) ? allCoursesRes.value.data.courses : [];
          const enrolledIds = new Set(myCourses.map(e => e.courseId?._id));
          const filtered = allCourses.filter(c => !enrolledIds.has(c._id)).slice(0, 2);
          setRecommendations(filtered);
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
  const [isMobileTabMenuOpen, setIsMobileTabMenuOpen] = useState(false);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart2, description: 'Stats & Learning Path' },
    { id: 'personal', label: 'Full Profile', icon: User, description: 'Identity & Academics' },
    { id: 'courses', label: 'My Learning', icon: Book, description: 'Active & Catalog' },
    { id: 'hackathons', label: 'Hackathons', icon: Code, description: 'Arena Registrations' },
    { id: 'resume', label: 'Executive Resume', icon: FileText, description: 'Builder & Templates' },
    { id: 'achievements', label: 'Certificates', icon: Award, description: 'Verified Merits' },
    { id: 'skills', label: 'Expertise', icon: Brain, description: 'Cognitive Matrix' },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, description: 'Archived Logic' },
  ];

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

  const calculateProfileScore = () => {
    if (!user) return 0;
    const fields = ['bio', 'phone', 'university', 'department', 'address', 'dateOfBirth', 'gender', 'website', 'profilePicture', 'bannerImage'];
    const filledFields = fields.filter(field => user[field]).length;
    const baseScore = 50; // Name, email, role are always present
    const dynamicScore = (filledFields / fields.length) * 50;
    return Math.round(baseScore + dynamicScore);
  };

  const profileScore = calculateProfileScore();

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
      blue: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20 group-hover:border-blue-500/50",
      green: "from-green-500/20 to-green-600/5 text-green-400 border-green-500/20 group-hover:border-green-500/50",
      purple: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20 group-hover:border-purple-500/50",
      orange: "from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/20 group-hover:border-orange-500/50"
    };

    const iconBgClasses = {
      blue: "bg-blue-500/10 text-blue-400",
      green: "bg-green-500/10 text-green-400",
      purple: "bg-purple-500/10 text-purple-400",
      orange: "bg-orange-500/10 text-orange-400"
    };

    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700/50 transition-all duration-300 overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative z-10 flex items-center gap-4">
          <div className={`${iconBgClasses[color]} rounded-xl p-3 border border-current/20 shadow-inner`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider font-semibold">{label}</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-white text-3xl font-black tracking-tight">{value}</span>
              {typeof value === 'number' && <span className="text-gray-500 text-xs font-medium">units</span>}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 relative group overflow-hidden ${activeTab === id
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-400/20'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/80'
        }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="whitespace-nowrap">{label}</span>
      {activeTab === id && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
          initial={false}
        />
      )}
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
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with Profile Banner */}
          <div className="mb-6 flex justify-center md:justify-start items-center">
            {user.role === 'student' && (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all border border-gray-700"
              >
                <Layout className="w-4 h-4" />
                Back to Dashboard
              </button>
            )}
          </div>
          <div className="relative mb-8 rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl bg-gray-900">
            {/* Profile Banner with Parallax-like effect */}
            <div
              className="h-48 sm:h-64 relative overflow-hidden"
              style={{
                background: bannerImage || user.bannerImage
                  ? `url(${bannerImage || user.bannerImage}) center/cover no-repeat`
                  : 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)'
              }}
            >
              {/* Animated Overlay */}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

              {!bannerImage && !user.bannerImage && (
                <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                  <svg width="100%" height="100%">
                    <pattern id="pattern-hex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 0L40 10V30L20 40L0 30V10L20 0Z" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pattern-hex)" />
                  </svg>
                </div>
              )}

              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex gap-2 sm:gap-3 z-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => bannerInputRef.current?.click()}
                  className="bg-gray-900/40 hover:bg-gray-900/60 text-white text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 backdrop-blur-md border border-white/10 transition-all font-bold tracking-wide"
                >
                  <Upload className="w-4 h-4" />
                  Change Cover
                </motion.button>
                <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
              </div>
            </div>

            {/* Profile Content Card */}
            <div className="px-4 sm:px-10 pb-6 sm:pb-10">
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start -mt-16 sm:-mt-24">
                {/* Avatar Section */}
                <div className="relative group shrink-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-1 px-1 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl"
                  >
                    <div className="bg-gray-900 rounded-full p-1">
                      {profileImage || user.profilePicture ? (
                        <img
                          src={profileImage || user.profilePicture}
                          alt={user.name}
                          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-gray-900"
                        />
                      ) : (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-4xl font-black text-white border-4 border-gray-900">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl border-2 border-gray-900 transition-all shadow-xl z-20"
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />

                  {/* Online Status */}
                  <div className="absolute top-6 right-6 w-6 h-6 bg-green-500 border-4 border-gray-900 rounded-full z-20 shadow-lg" />
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-6 pt-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3">
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">{user.name}</h1>
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[11px] sm:text-xs font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            user.role === 'faculty' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                              'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            }`}>
                            {user.role}
                          </span>
                          {user.isAdmin && (
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-[11px] sm:text-xs font-black uppercase tracking-widest">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm sm:text-base font-medium italic opacity-80 line-clamp-3 md:line-clamp-2 max-w-2xl mx-auto md:mx-0">
                        {user.bio || "Crafting digital experiences and pushing the boundaries of knowledge."}
                      </p>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openEditModal}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> Edit Profile
                      </motion.button>
                      <Link to="/settings">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl border border-gray-700 transition-all cursor-pointer"
                        >
                          <Shield className="w-5 h-5" />
                        </motion.div>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 bg-gray-800/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-gray-700/50 shadow-inner">
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-widest font-black text-gray-500">Email Address</p>
                        <p className="text-white font-bold truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-widest font-black text-gray-500">Academic Standing</p>
                        <p className="text-white font-bold truncate">{user.degree || user.department || 'Undergraduate'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-500">Location</p>
                        <p className="text-white font-bold truncate">{user.address || 'Global Campus'}</p>
                      </div>
                    </div>
                  </div>
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
                  <Link to="/resume-builder" className="inline-flex items-center text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors">
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

          {/* Main Content Area */}
          <div className="bg-gray-900/50 backdrop-blur-2xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Mobile Tab Selector - Filter Style */}
            <div className="sm:hidden border-b border-gray-700/50 bg-gray-800/40 p-4">
              <button
                onClick={() => setIsMobileTabMenuOpen(!isMobileTabMenuOpen)}
                className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    {React.createElement(TABS.find(t => t.id === activeTab)?.icon || BarChart2, { size: 24 })}
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase font-black text-gray-500 tracking-widest">Active Section</p>
                    <p className="text-lg font-black text-white">{TABS.find(t => t.id === activeTab)?.label}</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isMobileTabMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileTabMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gray-900 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl divide-y divide-gray-800/50"
                >
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileTabMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-5 p-5 transition-all hover:bg-gray-800/50 text-left ${activeTab === tab.id ? 'bg-blue-600/10' : ''}`}
                    >
                      <div className={`p-3 rounded-2xl border ${activeTab === tab.id ? 'bg-blue-600 text-white border-blue-400' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        <tab.icon size={22} />
                      </div>
                      <div>
                        <p className={`font-black text-base ${activeTab === tab.id ? 'text-blue-400' : 'text-white'}`}>{tab.label}</p>
                        <p className="text-xs text-gray-500 font-medium">{tab.description}</p>
                      </div>
                      {activeTab === tab.id && <Check className="ml-auto text-blue-400" size={20} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Desktop Tabs - Horizontal Scroll */}
            <div className="hidden sm:block border-b border-gray-700/50 bg-gray-800/20 px-6">
              <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar -mb-[1px]">
                {TABS.map((tab) => (
                  <TabButton key={tab.id} id={tab.id} label={tab.label} icon={tab.icon} />
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-10">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                  {/* Left Side: Activity & Stats */}
                  <div className="lg:col-span-8 space-y-10">
                    <section>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-blue-500" />
                          Learning Journey
                        </h2>
                        <Link to="/courses" className="text-blue-400 text-sm font-bold hover:underline">View All</Link>
                      </div>

                      {enrolledCourses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {enrolledCourses.slice(0, 3).map((enrollment, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5 hover:bg-gray-800/60 transition-all flex items-center gap-6"
                            >
                              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/10">
                                <BookOpen className="w-8 h-8 text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="text-lg font-bold text-white truncate">{enrollment.courseId?.title || 'Course'}</h3>
                                  <span className="text-sm font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">{enrollment.progress?.overallProgress || 0}%</span>
                                </div>
                                <ProgressBar value={enrollment.progress?.overallProgress || 0} />
                                <p className="mt-3 text-xs text-gray-500 uppercase font-black tracking-widest">
                                  Active since {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-800/20 rounded-3xl p-8 text-center border-2 border-dashed border-gray-700/50">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Book className="w-8 h-8 text-gray-600" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">Kickstart Your Learning</h3>
                          <p className="text-gray-400 text-xs max-w-sm mx-auto mb-6">You haven't enrolled in any courses yet. Expand your horizons today!</p>
                          <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-50 transition-colors shadow-xl"
                          >
                            Explore Courses <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </section>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-3xl border border-white/5 space-y-4">
                        <div className="p-3 bg-indigo-500/20 rounded-2xl w-fit">
                          <Award className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Earn Certificates</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Complete your enrolled courses to receive industry-recognized certification and showcase your expertise.</p>
                        <button className="text-indigo-400 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                          View Progress <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 p-6 rounded-3xl border border-white/5 space-y-4">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl w-fit">
                          <Zap className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Skill Up Fast</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Our AI-driven personalized learning paths help you focus on what matters most for your career goals.</p>
                        <button className="text-emerald-400 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                          Get Started <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Recommendations & Score */}
                  <div className="lg:col-span-4 space-y-10">
                    <div className="bg-gray-800/40 rounded-3xl p-8 border border-gray-700/50 text-center space-y-6">
                      <h3 className="text-lg font-black text-white uppercase tracking-widest opacity-60">Profile Strength</h3>
                      <div className="relative w-40 h-40 mx-auto">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 * (1 - (profileScore / 100))} className="text-blue-500" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-white">{profileScore}%</span>
                          <span className="text-xs text-gray-500 font-black uppercase tracking-tighter">
                            {profileScore === 100 ? 'Master Tier' : profileScore > 80 ? 'Elite Tier' : 'Growing Tier'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 font-medium">
                        {profileScore < 100 ? (
                          <>Complete your <span className="text-blue-400">Bio</span> and <span className="text-blue-400">Metadata</span> to reach 100%!</>
                        ) : (
                          <>Your profile is fully optimized for peak performance.</>
                        )}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <Star className="w-6 h-6 text-amber-500" />
                        Featured for You
                      </h2>
                      <div className="space-y-4">
                        {Array.isArray(recommendations) && recommendations.length > 0 ? recommendations.map((rec) => (
                          <Link
                            key={rec._id}
                            to={`/courses/${rec._id}`}
                            className="group block bg-gray-800/40 hover:bg-gray-800/60 p-5 rounded-2xl border border-gray-700/50 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                <Target className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate">{rec.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 uppercase font-black tracking-widest">{rec.category || 'Specialization'}</p>
                              </div>
                            </div>
                          </Link>
                        )) : (
                          <div className="p-8 text-center bg-gray-800/20 rounded-2xl border border-dashed border-gray-700">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-loose">No recommendations at this time. Keep learning!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'courses' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black text-white">My Learning Path</h2>
                      <p className="text-gray-400 font-medium">Manage and track your enrolled courses</p>
                    </div>
                    <Link to="/courses" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-blue-500/20 text-center">
                      Explore More
                    </Link>
                  </div>

                  {Array.isArray(enrolledCourses) && enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {enrolledCourses.map((enrollment, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ y: -8 }}
                          className="group bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-700/50 overflow-hidden shadow-xl hover:shadow-blue-500/10 transition-all"
                        >
                          {/* Course Header/Thumbnail */}
                          <div className="h-40 bg-gray-900 flex items-center justify-center relative">
                            {enrollment.courseId?.thumbnail ? (
                              <img src={enrollment.courseId.thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-blue-500/50" />
                              </div>
                            )}
                            <div className="absolute top-4 right-4">
                              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${enrollment.progress?.overallProgress === 100 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-blue-600 text-white'
                                }`}>
                                {enrollment.progress?.overallProgress === 100 ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                          </div>

                          <div className="p-6 space-y-4">
                            <div>
                              <h3 className="font-black text-xl text-white line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{enrollment.courseId?.title || 'Course Title'}</h3>
                              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">{enrollment.courseId?.category || 'Expert Track'}</p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                <span>Completion</span>
                                <span className="text-blue-400">{enrollment.progress?.overallProgress || 0}%</span>
                              </div>
                              <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden p-[2px] border border-gray-700/50">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${enrollment.progress?.overallProgress || 0}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 rounded-full"
                                />
                              </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-gray-700/50">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${enrollment.paymentStatus === 'paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-gray-600'}`} />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                                  {enrollment.paymentStatus === 'paid' ? 'Lifetime Access' : 'Academic Access'}
                                </span>
                              </div>
                              <Link
                                to={`/courses`}
                                className="bg-gray-700/50 hover:bg-blue-600 text-white p-3 rounded-2xl transition-all shadow-lg group-hover:scale-110 active:scale-95 border border-gray-600/50 hover:border-blue-400/50"
                              >
                                <ArrowRight className="w-5 h-5" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/20 rounded-3xl p-16 text-center border-2 border-dashed border-gray-700/50">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Book className="w-12 h-12 text-gray-700" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">No Active Courses</h3>
                      <p className="text-gray-400 max-w-sm mx-auto mb-10">Start your transformation today by enrolling in one of our expert-led programs.</p>
                      <Link
                        to="/courses"
                        className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl transition-all font-black text-sm shadow-2xl shadow-blue-500/40"
                      >
                        <Zap className="w-5 h-5" /> Explore Catalog
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'hackathons' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black text-white">Competitive Arena</h2>
                      <p className="text-gray-400 font-medium text-lg">Your registrations and active competitions</p>
                    </div>
                    <Link to="/hackathons" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-purple-500/20 text-center">
                      Challenge Yourself
                    </Link>
                  </div>

                  {Array.isArray(hackathonRegistrations) && hackathonRegistrations.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {hackathonRegistrations.map((registration) => (
                        <motion.div
                          key={registration._id}
                          whileHover={{ x: 10 }}
                          className="group relative bg-gray-800/40 backdrop-blur-md rounded-3xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-all overflow-hidden"
                        >
                          {/* Design Accent */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/10 transition-colors" />

                          <div className="flex flex-col sm:flex-row items-start gap-8 relative z-10">
                            <div className="p-5 bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform shadow-inner">
                              <Code className="w-8 h-8 text-purple-400" />
                            </div>

                            <div className="flex-1 space-y-6">
                              <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-black text-white tracking-tight">{registration.hackathonId?.title || 'Challenger Event'}</h3>
                                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${registration.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    registration.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    }`}>
                                    {registration.status}
                                  </span>
                                </div>
                                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                                  <Users className="w-4 h-4" /> Team: {registration.teamName} ({registration.teamSize} Core)
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/40 p-3 rounded-2xl border border-gray-700/30">
                                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Joined</p>
                                  <p className="text-white font-bold text-sm">{new Date(registration.submittedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-gray-900/40 p-3 rounded-2xl border border-gray-700/30">
                                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phase</p>
                                  <p className="text-white font-bold text-sm">Main Qualifier</p>
                                </div>
                              </div>

                              {registration.techStack && registration.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {registration.techStack.map((tech, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-purple-500/5 text-purple-400 text-[10px] font-black uppercase tracking-tight rounded-lg border border-purple-500/10">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="pt-2">
                                <Link
                                  to={`/hackathon/${registration.hackathonId?._id}`}
                                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-black text-xs uppercase tracking-widest transition-colors group/link"
                                >
                                  Mission Brief <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/20 rounded-3xl p-16 text-center border-2 border-dashed border-gray-700/50">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-12 h-12 text-gray-700" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">No Arena Records</h3>
                      <p className="text-gray-400 max-w-sm mx-auto mb-10">You haven't registered for any competitions. Prove your skills in the next major hackathon.</p>
                      <Link
                        to="/hackathons"
                        className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-2xl transition-all font-black text-sm shadow-2xl shadow-purple-500/40"
                      >
                        <Code className="w-5 h-5" /> Browse Events
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'resume' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                  {savedResume ? (
                    <div className="space-y-10">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-gray-700/50">
                        <div>
                          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Executive Resume</h2>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-gray-500 font-black text-[9px] uppercase tracking-widest">Last Verified</span>
                            <span className="text-blue-400 font-bold text-xs">{savedResume.lastUpdated ? new Date(savedResume.lastUpdated).toLocaleDateString() : 'Active Now'}</span>
                          </div>
                        </div>
                        <Link
                          to="/resume-builder"
                          className="flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-blue-50 shadow-xl"
                        >
                          <Edit size={16} /> Edit Portfolio
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Sidebar: Personal & Skills */}
                        <div className="lg:col-span-4 space-y-10">
                          {savedResume.personalInfo && (
                            <div className="bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 space-y-6">
                              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <User className="text-blue-500" size={18} /> Contact Info
                              </h3>
                              <div className="space-y-4">
                                <div className="group">
                                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 group-hover:text-blue-400 transition-colors">Digital Identity</p>
                                  <p className="text-white font-bold text-sm truncate">{savedResume.personalInfo.email || user.email}</p>
                                </div>
                                <div className="group">
                                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 group-hover:text-blue-400 transition-colors">Direct Line</p>
                                  <p className="text-white font-bold text-sm">{savedResume.personalInfo.phone || 'Private'}</p>
                                </div>
                                <div className="group">
                                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 group-hover:text-blue-400 transition-colors">HQ Location</p>
                                  <p className="text-white font-bold text-sm">{savedResume.personalInfo.location || 'Distributed'}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {savedResume.skills && (
                            <div className="space-y-8">
                              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3 px-2">
                                <Code className="text-amber-500" size={18} /> Core Stack
                              </h3>
                              <div className="space-y-6">
                                {savedResume.skills.technical && savedResume.skills.technical.length > 0 && (
                                  <div className="space-y-3">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest px-2">Technologies</p>
                                    <div className="flex flex-wrap gap-2">
                                      {savedResume.skills.technical.map((skill, idx) => (
                                        <span key={idx} className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border border-blue-500/20">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {savedResume.skills.tools && savedResume.skills.tools.length > 0 && (
                                  <div className="space-y-3">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest px-2">Tooling</p>
                                    <div className="flex flex-wrap gap-2">
                                      {savedResume.skills.tools.map((tool, idx) => (
                                        <span key={idx} className="bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border border-purple-500/20">
                                          {tool}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Main Content: Bio, Experience, Education */}
                        <div className="lg:col-span-8 space-y-12">
                          {savedResume.personalInfo?.summary && (
                            <section>
                              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                                <FileText className="text-emerald-500" size={18} /> Executive Summary
                              </h3>
                              <p className="text-gray-400 text-base leading-relaxed italic font-medium">
                                "{savedResume.personalInfo.summary}"
                              </p>
                            </section>
                          )}

                          {savedResume.experience && savedResume.experience.length > 0 && (
                            <section>
                              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                                <Briefcase className="text-indigo-500" size={18} /> Professional Experience
                              </h3>
                              <div className="space-y-10 border-l-2 border-gray-800 ml-2 pl-8">
                                {savedResume.experience.map((exp, idx) => (
                                  <div key={idx} className="relative group">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[41px] top-1.5 w-4 h-4 bg-gray-900 border-2 border-indigo-500 rounded-full group-hover:scale-125 transition-transform" />

                                    <div className="space-y-2">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <h4 className="font-black text-lg text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{exp.position}</h4>
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-gray-800 px-3 py-1 rounded-lg">
                                          {exp.startDate} - {exp.current ? 'PRESENT' : exp.endDate}
                                        </span>
                                      </div>
                                      <p className="text-indigo-400 font-black text-xs uppercase tracking-widest">{exp.company} • {exp.location}</p>
                                      {exp.description && <p className="mt-4 text-gray-400 leading-relaxed max-w-2xl">{exp.description}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </section>
                          )}

                          {savedResume.education && savedResume.education.length > 0 && (
                            <section>
                              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                                <GraduationCap className="text-purple-500" size={18} /> Academic Background
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {savedResume.education.map((edu, idx) => (
                                  <div key={idx} className="bg-gray-800/30 rounded-3xl p-6 border border-gray-700/50 hover:bg-gray-800/50 transition-all">
                                    <h4 className="font-black text-lg text-white uppercase tracking-tight line-clamp-1">{edu.degree}</h4>
                                    <p className="text-purple-400 font-bold text-xs mt-1">{edu.field}</p>
                                    <div className="mt-4 space-y-1">
                                      <p className="text-gray-400 text-sm font-medium">{edu.institution}</p>
                                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                    {edu.gpa && (
                                      <div className="mt-4 inline-block bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg text-[10px] font-black border border-purple-500/20">
                                        CGPA: {edu.gpa}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </section>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/20 rounded-3xl p-20 text-center border-2 border-dashed border-gray-700/50">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-12 h-12 text-gray-700" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">No Professional Profile</h3>
                      <p className="text-gray-400 max-w-sm mx-auto mb-10">You haven't initialized your executive portfolio. Create it now to apply for top-tier opportunities.</p>
                      <Link
                        to="/resume-builder"
                        className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl transition-all font-black text-sm shadow-2xl shadow-blue-500/40 uppercase tracking-widest"
                      >
                        <Zap className="w-5 h-5" /> Initialize Resume
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-700/50">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-blue-400">Credentials & Merits</h2>
                      <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-2">Verified Professional Achievements & Private Records</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadCertificatesAsPDF(certificates, 'Full Portfolio')}
                        disabled={isGeneratingPDF}
                        className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-blue-400 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-gray-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" /> Preparing...
                          </>
                        ) : (
                          <>
                            <Printer size={16} /> Export All (PDF)
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddCertificateModalOpen(true)}
                        className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
                      >
                        <Plus size={18} /> Add Recognition
                      </motion.button>
                    </div>
                  </div>

                  {/* Platform Certificates Section */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                      <Shield className="text-blue-500" size={20} />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Platform Achievements</h3>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/30 to-transparent ml-4" />
                      <button
                        onClick={() => downloadCertificatesAsPDF(certificates.filter(c => c.source === 'platform'), 'Platform Achievements')}
                        disabled={isGeneratingPDF}
                        className="flex items-center gap-2 text-xs font-black text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 disabled:opacity-50"
                      >
                        {isGeneratingPDF ? <Loader className="w-3 h-3 animate-spin" /> : <Download size={14} />}
                        {isGeneratingPDF ? 'Syncing...' : 'Download Section'}
                      </button>
                    </div>

                    {certificates.filter(c => c.source === 'platform').length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {certificates.filter(c => c.source === 'platform').map((cert) => (
                          <motion.div
                            key={cert._id}
                            whileHover={{ y: -10 }}
                            className="group relative bg-[#1a1c2e]/60 backdrop-blur-md rounded-3xl border border-blue-500/20 overflow-hidden shadow-2xl transition-all hover:shadow-blue-500/20"
                          >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                            <div className="p-5 sm:p-8">
                              <div className="aspect-[4/3] rounded-2xl mb-6 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 flex flex-col items-center justify-center border border-blue-500/10">
                                {cert.imageUrl ? (
                                  <img src={cert.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <>
                                    <Trophy className="w-16 h-16 text-blue-400" />
                                    <span className="text-xs font-black text-blue-500 uppercase mt-4">Verified Certificate</span>
                                  </>
                                )}
                              </div>
                              <div className="space-y-4">
                                <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{cert.title}</h4>
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{cert.issuer || 'E-Shikshan'}</span>
                                  <span className="text-xs font-black text-blue-400 uppercase">Issued: {new Date(cert.issuedDate).toLocaleDateString()}</span>
                                </div>
                                <div className="pt-4 flex gap-2">
                                  <button className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-800/10 rounded-3xl p-12 text-center border border-dashed border-gray-700/50">
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">No platform certificates earned yet</p>
                      </div>
                    )}
                  </div>

                  {/* Manual/Private Certificates Section */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                      <Bookmark className="text-purple-500" size={20} />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Private Repository</h3>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500/30 to-transparent ml-4" />
                      <button
                        onClick={() => downloadCertificatesAsPDF(certificates.filter(c => c.source !== 'platform'), 'Private Records')}
                        disabled={isGeneratingPDF}
                        className="flex items-center gap-2 text-xs font-black text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 disabled:opacity-50"
                      >
                        {isGeneratingPDF ? <Loader className="w-3 h-3 animate-spin" /> : <Download size={14} />}
                        {isGeneratingPDF ? 'Syncing...' : 'Download Section'}
                      </button>
                    </div>

                    {certificates.filter(c => c.source !== 'platform').length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {certificates.filter(c => c.source !== 'platform').map((cert) => (
                          <motion.div
                            key={cert._id}
                            whileHover={{ y: -10 }}
                            className="group relative bg-[#1a1c2e]/60 backdrop-blur-md rounded-3xl border border-purple-500/20 overflow-hidden shadow-2xl transition-all hover:shadow-purple-500/20"
                          >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
                            <div className="p-5 sm:p-8">
                              <div className="aspect-[4/3] rounded-2xl mb-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex flex-col items-center justify-center border border-purple-500/10 overflow-hidden">
                                {cert.imageUrl ? (
                                  <img src={cert.imageUrl} className="w-full h-full object-cover" />
                                ) : cert.pdfUrl ? (
                                  <>
                                    <FileText className="w-16 h-16 text-purple-400" />
                                    <span className="text-xs font-black text-purple-500 uppercase mt-4">PDF Document</span>
                                  </>
                                ) : (
                                  <>
                                    <Award className="w-16 h-16 text-purple-400" />
                                    <span className="text-xs font-black text-purple-500 uppercase mt-4">Manual Record</span>
                                  </>
                                )}
                              </div>
                              <div className="space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{cert.title}</h4>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCertificate(cert._id); }}
                                    className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{cert.issuer || 'Private Document'}</span>
                                  <span className="text-[10px] font-black text-purple-400 uppercase">Date: {new Date(cert.issuedDate).toLocaleDateString()}</span>
                                </div>
                                <div className="pt-4 flex gap-2">
                                  {cert.imageUrl || cert.pdfUrl ? (
                                    <a
                                      href={cert.imageUrl || cert.pdfUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-center transition-all"
                                    >
                                      View Document
                                    </a>
                                  ) : (
                                    <button disabled className="flex-1 bg-gray-800 text-gray-600 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
                                      No File Attached
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-800/10 rounded-3xl p-12 text-center border border-dashed border-gray-700/50">
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-4">Your private certificate vault is empty</p>
                        <button onClick={() => setIsAddCertificateModalOpen(true)} className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-blue-300 transition-colors">
                          Upload Your First Certificate
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'personal' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-700/50">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-blue-400">Identity Details</h2>
                      <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">Personal & Academic Metadata</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openEditModal}
                      className="flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl"
                    >
                      <Edit size={18} /> Update Meta
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 space-y-8">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 opacity-60">
                        <Fingerprint className="text-blue-500" size={18} /> Private Information
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-6 group">
                          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-700 group-hover:border-blue-500/30 transition-colors">
                            <User className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Full Legal Name</p>
                            <p className="text-xl font-bold text-white truncate">{user.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-700 group-hover:border-blue-500/30 transition-colors">
                            <Mail className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Primary Email</p>
                            <p className="text-xl font-bold text-white truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-700 group-hover:border-blue-500/30 transition-colors">
                            <Phone className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Authenticated Phone</p>
                            <p className="text-xl font-bold text-white">{user.phone || "Not Linked"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 space-y-8">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 opacity-60">
                        <GraduationCap className="text-purple-500" size={18} /> Academic Context
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-6 group">
                          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-700 group-hover:border-purple-500/30 transition-colors">
                            <Building className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Institution</p>
                            <p className="text-xl font-bold text-white truncate">{user.university || "Global Access"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-700 group-hover:border-purple-500/30 transition-colors">
                            <Book className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Department</p>
                            <p className="text-xl font-bold text-white truncate">{user.department || "General Sciences"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-700 group-hover:border-purple-500/30 transition-colors">
                            <Calendar className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Current Tenure</p>
                            <p className="text-xl font-bold text-white">{user.semester ? `${user.semester}th Semester` : "Enrolled Specialist"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'bookmarks' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-700/50">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-blue-400">Vaulted Content</h2>
                      <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-2">Saved Resources & Knowledge Units</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-900/50 p-1.5 rounded-2xl border border-gray-700/50">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">All</button>
                      <button className="px-4 py-2 text-gray-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Courses</button>
                      <button className="px-4 py-2 text-gray-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Insights</button>
                    </div>
                  </div>

                  <div className="bg-gray-800/20 rounded-3xl p-20 text-center border-2 border-dashed border-gray-700/50">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Bookmark className="w-12 h-12 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Empty Vault</h3>
                    <p className="text-gray-400 max-w-sm mx-auto mb-10">You haven't saved any resources yet. Start exploring courses and articles to build your personal library.</p>
                    <Link to="/courses" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">Start Exploring</Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-700/50">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-blue-400">Skill Acquisition</h2>
                      <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">Verified Competencies & Market Readiness</p>
                    </div>
                    <Link to="/courses" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl">Accelerate Growth</Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Target} label="Core Strength" value={enrolledCourses.length || 0} color="blue" />
                    <StatCard icon={CheckCircle} label="Completed" value={completedCourses || 0} color="green" />
                    <StatCard icon={Zap} label="In Vector" value={ongoingCourses || 0} color="orange" />
                    <StatCard icon={Award} label="Merits" value={totalCertificates || 0} color="purple" />
                  </div>

                  {/* Dynamic Skills Breakdown */}
                  <div className="space-y-12">
                    {/* Technical Skills from Resume */}
                    {savedResume?.skills?.technical?.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 opacity-60">
                          <Code className="text-blue-500" size={18} /> Technical Expertise
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {savedResume.skills.technical.map((skill, idx) => (
                            <div key={idx} className="bg-gray-800/40 px-6 py-3 rounded-2xl border border-gray-700/50 text-blue-400 font-bold text-sm uppercase tracking-tight hover:border-blue-500/30 transition-all">
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tools Skills from Resume */}
                    {savedResume?.skills?.tools?.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 opacity-60">
                          <Zap className="text-purple-500" size={18} /> Logic & Tooling
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {savedResume.skills.tools.map((tool, idx) => (
                            <div key={idx} className="bg-gray-800/40 px-6 py-3 rounded-2xl border border-gray-700/50 text-purple-400 font-bold text-sm uppercase tracking-tight hover:border-purple-500/30 transition-all">
                              {tool}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verified Course Progress */}
                    {enrolledCourses.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 opacity-60">
                          <CheckCircle className="text-emerald-500" size={18} /> Course-Derived Skills
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {enrolledCourses.map((enrollment, idx) => (
                            <div key={idx} className="group bg-gray-800/30 p-6 rounded-3xl border border-gray-700/50 hover:bg-gray-800/50 transition-all flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">{enrollment.courseId?.title}</h4>
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{enrollment.courseId?.category || 'Specialized Topic'}</p>
                              </div>
                              <div className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight border ${enrollment.progress?.overallProgress === 100
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                {enrollment.progress?.overallProgress === 100 ? 'Verified' : `${enrollment.progress?.overallProgress || 0}%`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fallback if no data */}
                    {!savedResume?.skills?.technical?.length && !savedResume?.skills?.tools?.length && !enrolledCourses.length && (
                      <div className="bg-gray-800/20 rounded-3xl p-20 text-center border-2 border-dashed border-gray-700/50">
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Brain className="w-12 h-12 text-gray-700" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Cognitive Map Blank</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mb-10">Start your journey into high-level concepts to populate your skill matrix.</p>
                        <Link to="/courses" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">Initialize Growth</Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          {/* Modals */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-[100] overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-gray-900/90 border border-gray-700/50 rounded-3xl sm:rounded-[2.5rem] max-w-4xl w-full my-4 sm:my-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh] sm:max-h-none"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -ml-32 -mt-32" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/20 rounded-full blur-3xl -mr-32 -mb-32" />
                  </div>
                  <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                    <div className="bg-white/10 p-2 sm:p-3 rounded-2xl backdrop-blur-md border border-white/20">
                      <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">Identity Nexus</h2>
                      <p className="text-blue-100/70 text-[9px] sm:text-xs font-bold uppercase tracking-widest mt-1">Recalibrating User Metadata</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="relative z-10 p-1.5 sm:p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-8 lg:p-12 overflow-y-auto max-h-[80vh] sm:max-h-[70vh] space-y-8 sm:space-y-12 custom-scrollbar">

                  {/* Profile Image & Banner Quick Check */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Layout className="text-blue-500" size={18} /> Visual Identity
                      </h3>
                      <div className="flex items-center gap-6 bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50">
                        <div className="relative">
                          <img
                            src={profileImage || user.profilePicture || "https://ui-avatars.com/api/?name=" + user.name}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/30"
                            alt="Avatar"
                          />
                          <button
                            onClick={() => profileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-lg shadow-lg border border-white/20 hover:bg-blue-500 transition-all"
                          >
                            <Edit size={12} className="text-white" />
                          </button>
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Profile Photo</p>
                          <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Upgrade your digital presence with a high-res avatar.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3 opacity-0">.</h3>
                      <div className="flex items-center gap-6 bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50 h-[108px]">
                        <div className="w-full bg-gray-900 rounded-2xl border border-gray-700/50 p-2 group relative overflow-hidden">
                          <div
                            className="h-12 w-full rounded-xl bg-cover bg-center"
                            style={{ backgroundImage: `url(${bannerImage || user.bannerImage || ''})`, backgroundColor: '#1e3a8a' }}
                          />
                          <button
                            onClick={() => bannerInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="text-[10px] font-black uppercase text-white tracking-widest">Change Banner</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <Fingerprint className="text-purple-500" size={18} /> Basic Authentication
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Full Legal Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-blue-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Primary Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-blue-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Contact Phone</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="text"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-blue-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Digital Portfolio</label>
                        <div className="relative group">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="text"
                            name="website"
                            value={editFormData.website}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-blue-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="https://portfolio.me"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Personal Narrative (Bio)</label>
                      <div className="relative group">
                        <Edit className="absolute left-4 top-5 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        <textarea
                          name="bio"
                          value={editFormData.bio}
                          onChange={handleEditChange}
                          rows="4"
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-3xl pl-12 pr-4 py-4 text-white focus:border-blue-500/50 focus:bg-gray-800 outline-none transition-all resize-none"
                          placeholder="Share your journey..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Section */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <GraduationCap className="text-emerald-500" size={18} /> Academic Vectors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Institution</label>
                        <div className="relative group">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="text"
                            name="university"
                            value={editFormData.university}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="University Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Department</label>
                        <div className="relative group">
                          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="text"
                            name="department"
                            value={editFormData.department}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="e.g. Computer Science"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Current Semester</label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="number"
                            name="semester"
                            value={editFormData.semester}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="Semester"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Degree Program</label>
                        <div className="relative group">
                          <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="text"
                            name="degree"
                            value={editFormData.degree}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="e.g. B.Tech, M.Sc"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Year of Study</label>
                        <div className="relative group">
                          <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="text"
                            name="yearOfStudy"
                            value={editFormData.yearOfStudy}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="e.g. 3rd Year"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Graduation Year</label>
                        <div className="relative group">
                          <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="text"
                            name="graduationYear"
                            value={editFormData.graduationYear}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-500/50 focus:bg-gray-800 outline-none transition-all"
                            placeholder="2026"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details Section */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <MapPin className="text-rose-500" size={18} /> Personal Locality
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Date of Birth</label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={editFormData.dateOfBirth ? new Date(editFormData.dateOfBirth).toISOString().split('T')[0] : ''}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-rose-500/50 focus:bg-gray-800 outline-none transition-all custom-calendar-icon"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Gender Identity</label>
                        <div className="relative group">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                          <select
                            name="gender"
                            value={editFormData.gender}
                            onChange={handleEditChange}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-rose-500/50 focus:bg-gray-800 outline-none transition-all appearance-none"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Residential Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-5 w-4 h-4 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                        <textarea
                          name="address"
                          value={editFormData.address}
                          onChange={handleEditChange}
                          rows="3"
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-3xl pl-12 pr-4 py-4 text-white focus:border-rose-500/50 focus:bg-gray-800 outline-none transition-all resize-none"
                          placeholder="Your physical location..."
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="p-5 sm:p-8 bg-gray-900/50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 border-t border-gray-700/30 backdrop-blur-md">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-gray-700/50"
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-8 sm:px-10 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Commit updates
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {isAddCertificateModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-gray-900/90 border border-gray-700/50 rounded-3xl max-w-xl w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 flex justify-between items-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -ml-16 -mt-16" />
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">Record Merit</h2>
                      <p className="text-purple-100/70 text-[9px] font-bold uppercase tracking-widest mt-0.5">Private Repository</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddCertificateModalOpen(false)}
                    className="relative z-10 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1">
                  <form onSubmit={handleAddCertificate} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Certificate Title</label>
                        <div className="relative group">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type="text"
                            required
                            value={certificateFormData.title}
                            onChange={(e) => setCertificateFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-purple-500/50 focus:bg-gray-800 outline-none transition-all placeholder:text-gray-600"
                            placeholder="e.g. AWS Solutions Architect"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Issuer Organization</label>
                          <input
                            type="text"
                            required
                            value={certificateFormData.issuer}
                            onChange={(e) => setCertificateFormData(prev => ({ ...prev, issuer: e.target.value }))}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3.5 text-sm text-white focus:border-purple-500/50 focus:bg-gray-800 outline-none transition-all placeholder:text-gray-600"
                            placeholder="e.g. Amazon"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Issued Date</label>
                          <input
                            type="date"
                            required
                            value={certificateFormData.issuedDate}
                            onChange={(e) => setCertificateFormData(prev => ({ ...prev, issuedDate: e.target.value }))}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3.5 text-sm text-white focus:border-purple-500/50 focus:bg-gray-800 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Description / Notes</label>
                        <textarea
                          value={certificateFormData.description}
                          onChange={(e) => setCertificateFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows="2"
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-purple-500/50 focus:bg-gray-800 outline-none transition-all resize-none placeholder:text-gray-600"
                          placeholder="Briefly describe achievement..."
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Document Attachment</label>
                        <div
                          onClick={() => certificateFileInputRef.current?.click()}
                          className="group border-2 border-dashed border-gray-700 hover:border-purple-500/50 bg-gray-800/20 rounded-2xl p-6 transition-all cursor-pointer flex items-center gap-4"
                        >
                          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-105 transition-transform">
                            <Upload size={24} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-white mb-0.5">Upload Certificate</p>
                            <p className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest">PDF, PNG, JPG (Max 5MB)</p>
                          </div>
                          {(certificateFormData.imageUrl || certificateFormData.pdfUrl) && (
                            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                              <CheckCircle size={12} />
                              <span className="text-[8px] font-black uppercase">File Linked</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={certificateFileInputRef}
                          onChange={handleCertificateFileUpload}
                          className="hidden"
                          accept="image/*,application/pdf"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddCertificateModalOpen(false)}
                        className="flex-1 px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Discard
                      </button>
                      <button
                        type="submit"
                        disabled={isUploadingCertificate}
                        className="flex-[1.5] px-6 py-3.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
                      >
                        {isUploadingCertificate ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Archiving...
                          </>
                        ) : (
                          <>
                            <Zap size={14} />
                            Commit to Repo
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          <input
            type="file"
            ref={bannerInputRef}
            onChange={handleBannerChange}
            className="hidden"
            accept="image/*"
          />
          <input
            type="file"
            ref={profileInputRef}
            onChange={handleProfileImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
    </>
  );
};

export default Profile;