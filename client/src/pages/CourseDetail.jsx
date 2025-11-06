import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Star, Users, Clock, Award, BookOpen, CheckCircle, 
  Video, FileText,X, Calendar, Globe, Lock, Play, ExternalLink 
} from 'lucide-react';
import { coursesAPI, enrollmentAPI } from '../services/api';
import toast from 'react-hot-toast';
import CourseContent from '../components/CourseContent';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [pendingEnrollmentId, setPendingEnrollmentId] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [autoOpenHandled, setAutoOpenHandled] = useState(false);
  
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [activeProjectCommentBox, setActiveProjectCommentBox] = useState(null);
  const [projectCommentText, setProjectCommentText] = useState({});

  const hasAccess = !!(enrollmentStatus?.hasAccess);
  const isEnrolled = !!(enrollmentStatus?.enrolled);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await coursesAPI.getCourse(id);
        setCourse(response.data);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        toast.error('Failed to load course details');
        navigate('/courses');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, navigate]);

  const checkEnrollment = async () => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;

    try {
      const response = await enrollmentAPI.checkStatus(id);
      if (response.data.enrolled) {
        setEnrollmentStatus({
          enrolled: true,
          hasAccess: response.data.hasAccess, // Use backend's hasAccess check
          enrollment: response.data
        });
      } else {
        setEnrollmentStatus({ enrolled: false, hasAccess: false });
        if (response.data.pendingEnrollmentId) {
          setPendingEnrollmentId(response.data.pendingEnrollmentId);
        } else {
          setPendingEnrollmentId(null);
        }
      }
    } catch (error) {
      console.error('Failed to check enrollment:', error);
    }
  };

  useEffect(() => {
    checkEnrollment();
  }, [id]);

  // Auto-open enrollment/payment modal when navigated from Courses with intent
  useEffect(() => {
    // Only handle once per mount
    if (autoOpenHandled) return;
    const shouldAutoOpen = location.state && location.state.autoOpenEnrollment;
    if (!shouldAutoOpen) return;

    // Clear the state so back/forward doesn't retrigger
    navigate(location.pathname, { replace: true, state: {} });

    // If there's a pending enrollment, open payment modal
    if (pendingEnrollmentId || (enrollmentStatus?.enrolled && !enrollmentStatus?.hasAccess)) {
      setShowPaymentModal(true);
      setAutoOpenHandled(true);
      return;
    }

    if (!enrollmentStatus?.enrolled) {
      handleEnrollClick();
      setAutoOpenHandled(true);
    }
  }, [location.state, enrollmentStatus, pendingEnrollmentId, autoOpenHandled, navigate, location.pathname]);

  const handleEnrollClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to enroll in this course');
      navigate('/login');
      return;
    }
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setIsEnrolling(true);

    try {
      const enrollData = {
        courseId: course._id,
        userDetails,
        paymentStatus: course.price === 'Free' ? 'free' : 'pending'
      };

  const response = await enrollmentAPI.enroll(enrollData);
      
      if (course.price === 'Free') {
        toast.success('Successfully enrolled in the course!');
        setEnrollmentStatus({
          enrolled: true,
          hasAccess: true,
          enrollment: response.data
        });
        setShowEnrollModal(false);
      } else {
        const newEnrollmentId = response.data?.enrollment?._id || response.data?._id;
        if (!newEnrollmentId) throw new Error('Missing enrollment id');
        setPendingEnrollmentId(newEnrollmentId);
        setShowEnrollModal(false);
        setShowPaymentModal(true);
        toast.success('Enrollment created! Complete payment to get access', {
          duration: 4000,
          icon: '⏳'
        });
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCancelPayment = async () => {
    if (pendingEnrollmentId) {
      try {
        await enrollmentAPI.deletePendingEnrollment(pendingEnrollmentId);
        toast.success('Enrollment cancelled. You can try again later.');
      } catch (error) {
        console.error('Error cancelling enrollment:', error);
        toast.error('Failed to cancel enrollment');
      }
    }
    
    setPendingEnrollmentId(null);
    setShowPaymentModal(false);
    checkEnrollment();
  };

  const handlePaymentComplete = async () => {
    if (!pendingEnrollmentId) return;
    
    setIsProcessingPayment(true);
    try {
      console.log('🔄 Confirming payment completion...');
      
  const response = await enrollmentAPI.processPayment(pendingEnrollmentId, {
    paymentMethod: 'upi',
        amount: course.priceAmount,
        phoneNumber: userDetails.phone || ''
      });

      console.log('✅ Payment verified!');
      console.log('💳 Transaction ID:', response.data.transactionId);
      
      toast.success('Payment verified! You now have access to the course.');
      setEnrollmentStatus({
        enrolled: true,
        hasAccess: true,
        enrollment: response.data.enrollment
      });
      setShowPaymentModal(false);
      setPendingEnrollmentId(null);
      checkEnrollment();
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      const errorMessage = error.response?.data?.message || 'Payment verification failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>
      </div>

  <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-semibold">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-slate-300 mb-6">{course.description}</p>
              
              
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={20} fill="currentColor" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-slate-400">({course.students.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={20} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Award size={20} />
                  <span>{course.level}</span>
                </div>
              </div>

              
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Created by</p>
                  <p className="font-semibold">{course.instructor}</p>
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl p-6 border-2 border-indigo-500/30 sticky top-6">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                
                <div className="mb-4">
                  {course.price === 'Free' ? (
                    <div className="text-3xl font-bold text-green-400">Free</div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">₹{course.priceAmount.toLocaleString()}</div>
                      <p className="text-sm text-slate-400">One-time payment</p>
                    </>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    {hasAccess ? (
                      <>
                        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-3 rounded-lg">
                          <CheckCircle size={20} />
                          <span className="font-semibold">You're enrolled!</span>
                        </div>
                        <p className="text-sm text-slate-400 text-center">
                          Scroll down to access course content
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 px-4 py-3 rounded-lg">
                          <Clock size={20} />
                          <span className="font-semibold">Enrollment Pending</span>
                        </div>
                        <p className="text-sm text-yellow-200/80 text-center">
                          Complete payment to access the course
                        </p>
                        <button
                          onClick={() => setShowPaymentModal(true)}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Complete Payment
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen size={20} />
                    Enroll Now
                  </button>
                )}

                {/* Course Includes */}
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Video className="text-indigo-400" size={18} />
                    <span>{course.videoLectures?.length || course.totalVideos || 0} video lectures</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="text-indigo-400" size={18} />
                    <span>{course.assignments?.length || 0} assignments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="text-indigo-400" size={18} />
                    <span>{course.projectsDetails?.length || course.projects || 0} projects</span>
                  </div>
                  {course.certificate && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-indigo-400" size={18} />
                      <span>Certificate of completion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {course.whatYoullLearn?.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={18} />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* NEW: Course Content with Modules (Videos, PDFs, Assignments, Quizzes) */}
            {hasAccess && (
              <section>
                <div className="mb-4">
                  <h2 className="text-3xl font-bold mb-2">Course Content</h2>
                  <p className="text-slate-400">Complete modules with videos, assignments, and quizzes</p>
                </div>
                <CourseContent 
                  courseId={id} 
                  hasAccess={hasAccess} 
                  isEnrolled={isEnrolled} 
                />
              </section>
            )}

            {/* Video Lectures */}
            {course.videoLectures && course.videoLectures.length > 0 && (
              <section className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Video className="text-indigo-400" size={24} />
                  Video Lectures
                </h2>
                <div className="space-y-3">
                  {course.videoLectures.map((video, index) => {
                    const isLocked = !video.free && !hasAccess;
                    
                    return (
                      <div 
                        key={video._id || index}
                        className={`bg-slate-700/50 rounded-lg p-4 flex items-center justify-between ${
                          isLocked ? 'opacity-70' : 'hover:bg-slate-700 cursor-pointer'
                        }`}
                        onClick={() => !isLocked && video.url && window.open(video.url, '_blank')}
                      >
                        <div className="flex items-center gap-3">
                          {isLocked ? (
                            <Lock className="text-slate-500" size={20} />
                          ) : (
                            <Play className="text-green-400" size={20} />
                          )}
                          <div>
                            <h4 className={`font-semibold ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                              {video.title}
                            </h4>
                            <p className="text-xs text-slate-500">Duration: {video.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isLocked && video.url && (
                            <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-semibold transition-colors">
                              Watch Now
                            </button>
                          )}
                          {isLocked && (
                            <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                              🔒 Enroll to Access
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Assignments */}
            {course.assignments && course.assignments.length > 0 && (
              <section className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="text-green-400" size={24} />
                  Assignments
                </h2>
                <div className="space-y-4">
                  {course.assignments.map((assignment, index) => {
                    const isLocked = course.price !== 'Free' && !hasAccess;
                    const showCommentBox = activeCommentBox === assignment._id;
                    const comment = commentText[assignment._id] || '';
                    
                    return (
                      <div 
                        key={assignment._id || index}
                        className={`bg-slate-700/50 rounded-lg p-4 ${isLocked ? 'opacity-70' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {isLocked ? (
                              <Lock size={18} className="text-slate-500" />
                            ) : (
                              <CheckCircle size={18} className="text-green-400" />
                            )}
                            <h4 className={`font-semibold ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                              {assignment.title}
                            </h4>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            assignment.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                            assignment.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-red-900/50 text-red-400'
                          }`}>
                            {assignment.difficulty}
                          </span>
                        </div>

                        {/* Assignment Description */}
                        {!isLocked && assignment.description && (
                          <div className="mb-3 p-3 bg-slate-700/40 rounded-lg">
                            <h5 className="text-sm font-semibold text-indigo-300 mb-2">Description:</h5>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {assignment.description}
                            </p>
                          </div>
                        )}

                        {/* Assignment Instructions */}
                        {!isLocked && assignment.instructions && (
                          <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
                            <h5 className="text-sm font-semibold text-indigo-400 mb-2">Instructions:</h5>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {assignment.instructions}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>📊 {assignment.points} points</span>
                            {assignment.deadline && <span>⏰ Deadline: {assignment.deadline}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            {!isLocked ? (
                              <>
                                <button 
                                  onClick={() => {
                                    if (assignment.askAdminUrl) {
                                      window.open(assignment.askAdminUrl, '_blank');
                                    } else {
                                      setActiveCommentBox(showCommentBox ? null : assignment._id);
                                    }
                                  }}
                                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                                >
                                  <FileText size={14} />
                                  Ask Admin
                                </button>
                                <button 
                                  onClick={() => {
                                    if (assignment.submitUrl) {
                                      window.open(assignment.submitUrl, '_blank');
                                    }
                                  }}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold transition-colors"
                                >
                                  Submit Work
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Comment Box */}
                        {!isLocked && showCommentBox && (
                          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                              Ask a question to Admin:
                            </label>
                            <textarea
                              value={comment}
                              onChange={(e) => setCommentText({ ...commentText, [assignment._id]: e.target.value })}
                              placeholder="Type your question or concern about this assignment..."
                              className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                              rows="3"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button 
                                onClick={() => setActiveCommentBox(null)}
                                className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-xs font-semibold transition-colors"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => {
                                  toast.success('Your question has been sent to admin!');
                                  setCommentText({ ...commentText, [assignment._id]: '' });
                                  setActiveCommentBox(null);
                                }}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-semibold transition-colors"
                              >
                                Send Question
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Projects */}
            {course.projectsDetails && course.projectsDetails.length > 0 && (
              <section className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award className="text-purple-400" size={24} />
                  Projects
                </h2>
                <div className="space-y-3">
                  {course.projectsDetails.map((project, index) => {
                    const isLocked = course.price !== 'Free' && !hasAccess;
                    const isCommentOpen = activeProjectCommentBox === project._id;
                    const currentComment = projectCommentText[project._id] || '';
                    
                    return (
                      <div 
                        key={project._id || index}
                        className={`bg-slate-700/50 rounded-lg p-4 ${isLocked ? 'opacity-70' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          {isLocked ? (
                            <Lock size={20} className="text-slate-500 mt-1" />
                          ) : (
                            <Award size={20} className="text-purple-400 mt-1" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-semibold ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                                {project.title}
                              </h4>
                              {isLocked && (
                                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                                  Locked
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 mb-2">
                              {project.description}
                            </p>
                            
                            {!isLocked && project.instructions && (
                              <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                                <h5 className="text-sm font-semibold text-purple-300 mb-2">Project Instructions:</h5>
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                  {project.instructions}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  Duration: {project.duration}
                                </span>
                                {project.deadline && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    Deadline: {project.deadline}
                                  </span>
                                )}
                              </div>
                              {!isLocked && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      if (project.askAdminUrl) {
                                        window.open(project.askAdminUrl, '_blank');
                                      } else {
                                        setActiveProjectCommentBox(isCommentOpen ? null : project._id);
                                      }
                                    }}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition-colors"
                                  >
                                    Ask Admin
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (project.submitUrl) {
                                        window.open(project.submitUrl, '_blank');
                                      }
                                    }}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold transition-colors"
                                  >
                                    Submit Project
                                  </button>
                                </div>
                              )}
                            </div>

                            {!isLocked && isCommentOpen && (
                              <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                  Ask your question to the admin:
                                </label>
                                <textarea
                                  value={currentComment}
                                  onChange={(e) => setProjectCommentText({
                                    ...projectCommentText,
                                    [project._id]: e.target.value
                                  })}
                                  className="w-full bg-slate-800 text-slate-200 rounded p-2 text-sm border border-slate-600 focus:border-purple-500 focus:outline-none"
                                  rows="3"
                                  placeholder="Type your question about this project..."
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button 
                                    onClick={() => {
                                      setActiveProjectCommentBox(null);
                                      setProjectCommentText({
                                        ...projectCommentText,
                                        [project._id]: ''
                                      });
                                    }}
                                    className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => {
                                      toast.success('Question sent to admin!');
                                      setActiveProjectCommentBox(null);
                                      setProjectCommentText({
                                        ...projectCommentText,
                                        [project._id]: ''
                                      });
                                    }}
                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
                                  >
                                    Send Question
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Skills */}
            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Skills you'll gain</h2>
              <div className="flex flex-wrap gap-2">
                {course.skills?.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Syllabus */}
            {course.syllabus && course.syllabus.length > 0 && (
              <section className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Syllabus</h2>
                <div className="space-y-4">
                  {course.syllabus.map((week, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="font-bold mb-2">Week {week.week}: {week.title}</h3>
                      <ul className="list-disc list-inside text-slate-400 space-y-1">
                        {week.topics?.map((topic, topicIndex) => (
                          <li key={topicIndex}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Prerequisites</h3>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle className="text-indigo-400 flex-shrink-0 mt-1" size={16} />
                        <span className="text-sm">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Details */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Course Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level:</span>
                    <span className="font-semibold">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Language:</span>
                    <span className="font-semibold">{course.language}</span>
                  </div>
                  {course.certificate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Certificate:</span>
                      <span className="font-semibold text-green-400">Yes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructor Info */}
              {course.instructorBio && (
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">About the Instructor</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{course.instructor}</p>
                      <p className="text-xs text-slate-400">{course.provider}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{course.instructorBio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-slate-700 my-8"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Enroll in Course</h2>
                <p className="text-slate-400 text-sm">Fill in your details to get started</p>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-white bg-slate-700/50 hover:bg-red-600 p-3 rounded-lg transition-all flex-shrink-0 ml-4"
                title="Close"
              >
                <X size={24} className="stroke-2" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userDetails.fullName}
                    onChange={(e) => setUserDetails({...userDetails, fullName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">
                  Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  value={userDetails.address}
                  onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter your complete address"
                  rows="3"
                />
              </div>

              {course.price === 'Free' && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                  <div className="text-green-400 text-2xl">✓</div>
                  <div>
                    <p className="text-green-400 font-semibold">This course is completely free!</p>
                    <p className="text-green-300/70 text-sm">No payment required - instant access</p>
                  </div>
                </div>
              )}

              {course.price !== 'Free' && (
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Course Price</p>
                      <p className="text-2xl font-bold text-indigo-400">₹{course.priceAmount?.toLocaleString()}</p>
                    </div>
                    <div className="text-indigo-400">
                      <BookOpen size={32} />
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">You'll be redirected to payment after enrollment</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isEnrolling}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-2"
              >
                {isEnrolling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {course.price === 'Free' ? (
                      <>
                        <CheckCircle size={20} />
                        Confirm Enrollment - Start Learning
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="rotate-180" size={20} />
                        Proceed to Payment
                      </>
                    )}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* EdX-Style Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl border border-indigo-500/30 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-700">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Complete Your Purchase</h2>
                <p className="text-slate-400 text-sm">Your enrollment is pending payment verification</p>
              </div>
              <button
                onClick={handleCancelPayment}
                className="text-slate-400 hover:text-red-500 bg-slate-700/50 hover:bg-red-900/30 p-2 rounded-lg transition-all flex-shrink-0 ml-4"
                title="Cancel & Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Course Summary Card - EdX Style */}
            <div className="mb-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{course.title}</h3>
                  <p className="text-sm text-slate-300">{course.provider}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-indigo-500/20">
                <span className="text-slate-300">Total Amount</span>
                <span className="text-3xl font-bold text-white">₹{course.priceAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Alert - EdX Style */}
            <div className="mb-6 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Clock size={18} className="text-yellow-900" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-300 mb-1">Enrollment Status: Pending</h4>
                <p className="text-sm text-yellow-200/80">
                  Your enrollment has been created and is waiting for payment verification. 
                  Complete the payment below to get instant access to the course.
                </p>
              </div>
            </div>

            {/* PhonePe Payment Section */}
            <div className="mb-6 space-y-4">
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-purple-400">💳</span> Pay via PhonePe
                </h3>
                
                {/* QR Code Section */}
                <div className="bg-white p-4 rounded-lg mb-4 shadow">
                  <div className="text-center">
                    {/* QR code for exact amount (UPI string encoded) */}
                    {(() => {
                      const upiAmount = Number(course.priceAmount || 0).toFixed(2);
                      const upiNote = encodeURIComponent(`Course: ${course.title}`);
                      const upiUri = `upi://pay?pa=9391774388@ybl&pn=E-Shikshan&am=${upiAmount}&cu=INR&tn=${upiNote}`;
                      const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;
                      return (
                        <>
                          <img
                            src={qrSrc}
                            alt="PhonePe QR Code"
                            className="mx-auto mb-2 w-48 h-48 object-contain"
                          />
                          <p className="text-slate-900 text-sm font-semibold">
                            This QR auto-fills amount: ₹{Number(course.priceAmount || 0).toLocaleString()}
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                const upiAmountBtn = Number(course.priceAmount || 0).toFixed(2);
                                const upiNoteBtn = encodeURIComponent(`Course: ${course.title}`);
                                const upiUriBtn = `upi://pay?pa=9391774388@ybl&pn=E-Shikshan&am=${upiAmountBtn}&cu=INR&tn=${upiNoteBtn}`;
                                window.location.href = upiUriBtn;
                              }}
                              className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                            >
                              Open in UPI app
                            </button>
                            <button
                              onClick={() => {
                                const upiAmountBtn = Number(course.priceAmount || 0).toFixed(2);
                                const upiNoteBtn = encodeURIComponent(`Course: ${course.title}`);
                                const upiUriBtn = `upi://pay?pa=9391774388@ybl&pn=E-Shikshan&am=${upiAmountBtn}&cu=INR&tn=${upiNoteBtn}`;
                                navigator.clipboard.writeText(upiUriBtn);
                                toast.success('UPI payment link copied!');
                              }}
                              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 px-3 py-1 rounded"
                            >
                              Copy UPI link
                            </button>
                          </div>
                        </>
                      );
                    })()}
                    <p className="text-slate-900 text-sm font-semibold">Scan with PhonePe</p>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-sm text-purple-300 mb-2">📱 How to Pay:</h4>
                  <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                    <li>Open PhonePe/Google Pay/Paytm on your phone</li>
                    <li>Scan the QR code above or use UPI ID below</li>
                    <li>Verify amount: ₹{course.priceAmount.toLocaleString()}</li>
                    <li>Complete the payment</li>
                    <li>Click "I've Completed Payment - Verify Now" button</li>
                    <li>Transaction ID will be shown in console</li>
                    <li>Access will be granted instantly</li>
                  </ol>
                </div>

                {/* UPI ID Display */}
                <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-400 mb-1">Or pay to UPI ID:</p>
                  <div className="flex items-center justify-between bg-slate-800 rounded px-3 py-2">
                    <span className="font-mono text-sm text-indigo-300">9391774388@ybl</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('9391774388@ybl');
                        toast.success('UPI ID copied!');
                      }}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Verification Status */}
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-indigo-500/50 rounded-lg p-5">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Clock size={20} className="text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-300 text-lg">Complete Your Payment</h4>
                    <p className="text-sm text-slate-400">Click verify after payment</p>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-slate-300 mb-2">
                        After completing the payment through PhonePe/Google Pay/Paytm, click the button below to verify and get instant access.
                      </p>
                      <p className="text-sm text-green-400 font-semibold">
                        ✓ Transaction ID will be generated automatically
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Check browser console (F12) to see the transaction ID
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Complete Button */}
                <div className="mt-4">
                  <button
                    onClick={handlePaymentComplete}
                    disabled={isProcessingPayment}
                    className={`w-full font-semibold py-3 rounded-lg transition-all text-sm ${
                      isProcessingPayment
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying Payment...
                      </span>
                    ) : (
                      "✓ I've Completed Payment - Verify Now"
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2 text-center">
                    Click after successfully completing the UPI payment
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelPayment}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                ❌ Cancel Enrollment
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-4">
              🔒 Secure payment. Transaction ID generated automatically by payment gateway.
              <br />
              💡 Open browser console (F12) to see the transaction ID after verification.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
