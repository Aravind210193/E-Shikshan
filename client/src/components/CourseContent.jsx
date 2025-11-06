import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Lock, CheckCircle, Download, FileText, Award, 
  ChevronDown, ChevronRight, Clock, BookOpen, Video,
  ExternalLink, PlayCircle, Star, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { courseContentAPI } from '../services/api';

const CourseContent = ({ courseId, hasAccess, isEnrolled }) => {
  const [modules, setModules] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    if (courseId && hasAccess) {
      fetchCourseContent();
      fetchUserProgress();
    }
  }, [courseId, hasAccess]);

  const fetchCourseContent = async () => {
    try {
      setIsLoading(true);
      const response = await courseContentAPI.getContent(courseId);
      setModules(response.data.modules || []);
    } catch (error) {
      console.error('Failed to fetch course content:', error);
      
      // If no content found in database, load from JSON (fallback for development)
      if (error.response?.status === 404) {
        console.log('Backend content not available, loading demo content...');
        loadMockData();
      } else {
        toast.error('Failed to load course content');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    // Mock data for demonstration when backend content not available
    const mockModules = [
      {
        _id: '1',
        title: 'Introduction to the Course',
        description: 'Get started with the fundamentals',
        order: 1,
        videos: [
          {
            _id: 'v1',
            title: 'Welcome & Course Overview',
            description: 'Introduction to what you will learn',
            duration: '10:30',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            free: true,
            order: 1
          },
          {
            _id: 'v2',
            title: 'Setting Up Your Environment',
            description: 'Install necessary tools and software',
            duration: '15:45',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            free: false,
            order: 2
          }
        ],
        resources: [
          {
            _id: 'r1',
            title: 'Course Syllabus',
            description: 'Complete course outline and schedule',
            type: 'PDF',
            url: '/pdfs/syllabus.pdf',
            size: '2.3 MB',
            order: 1
          },
          {
            _id: 'r2',
            title: 'Installation Guide',
            description: 'Step-by-step setup instructions',
            type: 'PDF',
            url: '/pdfs/installation-guide.pdf',
            size: '1.8 MB',
            order: 2
          }
        ],
        assignments: [
          {
            _id: 'a1',
            title: 'Environment Setup Assignment',
            description: 'Set up your development environment and submit screenshots',
            instructions: 'Follow the installation guide and submit proof of setup',
            difficulty: 'Easy',
            points: 10,
            deadline: new Date('2025-12-31'),
            submissionUrl: 'https://forms.google.com/submission1',
            askAdminUrl: 'https://wa.me/1234567890',
            order: 1
          }
        ],
        quizzes: [
          {
            _id: 'q1',
            title: 'Introduction Quiz',
            description: 'Test your understanding of course basics',
            duration: 15,
            passingScore: 70,
            attempts: 3,
            questions: [
              {
                _id: 'q1q1',
                question: 'What is the main objective of this course?',
                options: [
                  'Learn web development',
                  'Learn mobile development',
                  'Learn data science',
                  'Learn all of the above'
                ],
                correctAnswer: 0,
                explanation: 'This course focuses on web development fundamentals',
                points: 1
              },
              {
                _id: 'q1q2',
                question: 'Which tool is required for this course?',
                options: [
                  'VS Code',
                  'Photoshop',
                  'Excel',
                  'PowerPoint'
                ],
                correctAnswer: 0,
                explanation: 'VS Code is the primary code editor we will use',
                points: 1
              }
            ],
            order: 1
          }
        ],
        isLocked: false
      }
    ];
    
    setModules(mockModules);
  };

  const fetchUserProgress = async () => {
    try {
      const response = await courseContentAPI.getProgress(courseId);
      setUserProgress(response.data || {
        completedVideos: [],
        completedQuizzes: [],
        completedAssignments: [],
        overallProgress: 0
      });
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
      // Set default progress if error
      setUserProgress({
        completedVideos: [],
        completedQuizzes: [],
        completedAssignments: [],
        overallProgress: 0,
        moduleProgress: []
      });
    }
  };

  const markVideoComplete = async (videoId, moduleId) => {
    try {
      await courseContentAPI.markVideoComplete(courseId, { videoId, moduleId });
      toast.success('Video marked as complete!');
      fetchUserProgress();
    } catch (error) {
      console.error('Failed to mark video complete:', error);
      toast.error('Failed to update progress');
    }
  };

  const downloadResource = async (resource) => {
    try {
      window.open(resource.url, '_blank');
      // TODO: Track download in progress
      toast.success('Opening resource...');
    } catch (error) {
      console.error('Failed to download resource:', error);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  if (!isEnrolled) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <Lock className="mx-auto h-16 w-16 text-slate-600 mb-4" />
        <h3 className="text-xl font-bold mb-2">Enroll to Access Course Content</h3>
        <p className="text-slate-400">
          This course content is only available to enrolled students.
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <Clock className="mx-auto h-16 w-16 text-yellow-600 mb-4" />
        <h3 className="text-xl font-bold mb-2">Complete Payment to Access Content</h3>
        <p className="text-slate-400">
          Your enrollment is pending payment verification.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-slate-400">Loading course content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Your Progress</h3>
          <span className="text-indigo-400 font-bold">
            {userProgress?.overallProgress || 0}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${userProgress?.overallProgress || 0}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
          <div className="text-center">
            <Video className="mx-auto text-indigo-400 mb-1" size={20} />
            <p className="text-slate-400">Videos</p>
            <p className="font-semibold">{userProgress?.completedVideos?.length || 0}</p>
          </div>
          <div className="text-center">
            <FileText className="mx-auto text-green-400 mb-1" size={20} />
            <p className="text-slate-400">Assignments</p>
            <p className="font-semibold">{userProgress?.completedAssignments?.length || 0}</p>
          </div>
          <div className="text-center">
            <Award className="mx-auto text-yellow-400 mb-1" size={20} />
            <p className="text-slate-400">Quizzes</p>
            <p className="font-semibold">{userProgress?.completedQuizzes?.length || 0}</p>
          </div>
          <div className="text-center">
            <Trophy className="mx-auto text-purple-400 mb-1" size={20} />
            <p className="text-slate-400">Score</p>
            <p className="font-semibold">{userProgress?.totalScore || 0}</p>
          </div>
        </div>
      </div>

      {/* Course Modules */}
      <div className="space-y-4">
        {modules.map((module, index) => (
          <motion.div
            key={module._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800 rounded-xl overflow-hidden"
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module._id)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">
                  {module.order}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">{module.title}</h3>
                  <p className="text-slate-400 text-sm">{module.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {module.isLocked && <Lock className="text-slate-500" size={20} />}
                {expandedModule === module._id ? (
                  <ChevronDown size={24} />
                ) : (
                  <ChevronRight size={24} />
                )}
              </div>
            </button>

            {/* Module Content */}
            <AnimatePresence>
              {expandedModule === module._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-700"
                >
                  <div className="p-6 space-y-6">
                    {/* Videos */}
                    {module.videos && module.videos.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <PlayCircle className="text-indigo-400" size={20} />
                          Video Lectures ({module.videos.length})
                        </h4>
                        <div className="space-y-2">
                          {module.videos.map((video) => {
                            const isCompleted = userProgress?.completedVideos?.includes(video._id);
                            return (
                              <div
                                key={video._id}
                                className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {isCompleted ? (
                                    <CheckCircle className="text-green-400" size={20} />
                                  ) : (
                                    <Play className="text-indigo-400" size={20} />
                                  )}
                                  <div className="flex-1">
                                    <h5 className="font-semibold">{video.title}</h5>
                                    <p className="text-sm text-slate-400">{video.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                      <Clock className="inline" size={12} /> {video.duration}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    window.open(video.url, '_blank');
                                    markVideoComplete(video._id, module._id);
                                  }}
                                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                >
                                  <Play size={16} />
                                  Watch
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Resources/PDFs */}
                    {module.resources && module.resources.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <FileText className="text-green-400" size={20} />
                          Resources & PDFs ({module.resources.length})
                        </h4>
                        <div className="space-y-2">
                          {module.resources.map((resource) => (
                            <div
                              key={resource._id}
                              className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="text-green-400" size={20} />
                                <div>
                                  <h5 className="font-semibold">{resource.title}</h5>
                                  <p className="text-sm text-slate-400">{resource.description}</p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {resource.type} • {resource.size}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => downloadResource(resource)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                              >
                                <Download size={16} />
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assignments */}
                    {module.assignments && module.assignments.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <BookOpen className="text-yellow-400" size={20} />
                          Assignments ({module.assignments.length})
                        </h4>
                        <div className="space-y-2">
                          {module.assignments.map((assignment) => {
                            const isSubmitted = userProgress?.completedAssignments?.includes(assignment._id);
                            return (
                              <div
                                key={assignment._id}
                                className="bg-slate-700/50 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h5 className="font-semibold">{assignment.title}</h5>
                                      <span className={`text-xs px-2 py-1 rounded ${
                                        assignment.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                                        assignment.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                                        'bg-red-900/50 text-red-400'
                                      }`}>
                                        {assignment.difficulty}
                                      </span>
                                      {isSubmitted && (
                                        <CheckCircle className="text-green-400" size={16} />
                                      )}
                                    </div>
                                    <p className="text-sm text-slate-400 mb-2">{assignment.description}</p>
                                    {assignment.instructions && (
                                      <p className="text-xs text-slate-500 bg-slate-800 p-2 rounded">
                                        📝 {assignment.instructions}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-indigo-400">
                                      {assignment.points} pts
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {assignment.askAdminUrl && (
                                    <button
                                      onClick={() => window.open(assignment.askAdminUrl, '_blank')}
                                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-sm font-semibold transition-colors flex items-center gap-1"
                                    >
                                      <ExternalLink size={14} />
                                      Ask Admin
                                    </button>
                                  )}
                                  {assignment.submissionUrl && (
                                    <button
                                      onClick={() => window.open(assignment.submissionUrl, '_blank')}
                                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold transition-colors flex items-center gap-1"
                                    >
                                      <ExternalLink size={14} />
                                      Submit Work
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quizzes */}
                    {module.quizzes && module.quizzes.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Award className="text-purple-400" size={20} />
                          Quizzes ({module.quizzes.length})
                        </h4>
                        <div className="space-y-2">
                          {module.quizzes.map((quiz) => {
                            const attempts = userProgress?.quizAttempts?.filter(a => a.quizId === quiz._id) || [];
                            const bestScore = attempts.length > 0 
                              ? Math.max(...attempts.map(a => a.percentage)) 
                              : 0;
                            const passed = bestScore >= quiz.passingScore;
                            
                            return (
                              <div
                                key={quiz._id}
                                className="bg-slate-700/50 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h5 className="font-semibold">{quiz.title}</h5>
                                      {passed && (
                                        <CheckCircle className="text-green-400" size={16} />
                                      )}
                                    </div>
                                    <p className="text-sm text-slate-400">{quiz.description}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                      <span>⏱️ {quiz.duration} min</span>
                                      <span>📝 {quiz.questions.length} questions</span>
                                      <span>✅ {quiz.passingScore}% to pass</span>
                                      <span>🔄 {quiz.attempts - attempts.length} attempts left</span>
                                    </div>
                                    {bestScore > 0 && (
                                      <p className="text-sm mt-2">
                                        Best Score: <span className={`font-semibold ${passed ? 'text-green-400' : 'text-yellow-400'}`}>
                                          {bestScore}%
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setSelectedQuiz(quiz)}
                                    disabled={attempts.length >= quiz.attempts}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                      attempts.length >= quiz.attempts
                                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                    }`}
                                  >
                                    {passed ? 'Retake Quiz' : attempts.length > 0 ? 'Try Again' : 'Start Quiz'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Quiz Modal */}
      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onComplete={() => {
            fetchUserProgress();
            setSelectedQuiz(null);
          }}
        />
      )}
    </div>
  );
};

// Quiz Modal Component
const QuizModal = ({ quiz, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60); // Convert to seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = () => {
    // Calculate score
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        correct++;
      }
    });

    const percentage = Math.round((correct / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingScore;

    // TODO: Submit to backend
    toast.success(passed ? '🎉 Congratulations! You passed!' : 'Keep trying! You can do it!');
    setShowResults(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Quiz Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{quiz.title}</h2>
            <p className="text-slate-400 text-sm">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-400">
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs text-slate-400">Time Remaining</p>
          </div>
        </div>

        {/* Quiz Content */}
        {!showResults ? (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                {quiz.questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(quiz.questions[currentQuestion]._id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      answers[quiz.questions[currentQuestion]._id] === index
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[quiz.questions[currentQuestion]._id] === index
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-slate-600'
                      }`}>
                        {answers[quiz.questions[currentQuestion]._id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <Trophy className="mx-auto h-20 w-20 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
            <button
              onClick={onComplete}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
            >
              Continue Learning
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
};

export default CourseContent;
