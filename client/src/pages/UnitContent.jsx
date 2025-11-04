import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  FileText,
  Download,
  CheckCircle,
  Video,
  BookOpen,
  ClipboardList,
  Trophy,
  ExternalLink,
  Lock,
  PlayCircle,
  Pause,
  Volume2,
  Maximize,
  Settings
} from 'lucide-react';
import semesterData from '../data/semesterData.json';

const UnitContent = () => {
  const { branch, semester, subjectCode, unitIndex } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');
  const contentTopRef = useRef(null);
  const [subjectData, setSubjectData] = useState(null);
  const [unitData, setUnitData] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedItems, setCompletedItems] = useState({
    videos: [],
    pdfs: [],
    assignments: [],
    quizzes: []
  });

  const branchSyllabusData = semesterData.branches;

  useEffect(() => {
    const branch_data = branchSyllabusData[branch];
    if (branch_data && branch_data.semesters[semester]) {
      const subject = branch_data.semesters[semester].subjects.find(
        s => s.code === subjectCode
      );
      setSubjectData(subject);
      
      if (subject && subject.units && subject.units[unitIndex]) {
        const unit = subject.units[unitIndex];
        setUnitData(unit);
        
        // Set first video as current if available
        if (unit.videos && unit.videos.length > 0) {
          setCurrentVideo(unit.videos[0]);
        }
      }
    }
  }, [branch, semester, subjectCode, unitIndex]);

  // Initialize tab from query parameter (?tab=videos|pdfs|assignments|quizzes)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    const allowed = ['videos', 'pdfs', 'assignments', 'quizzes'];
    if (tab && allowed.includes(tab)) {
      setActiveTab(tab);
      // Scroll to content after tab set
      setTimeout(() => {
        if (contentTopRef.current) contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [location.search]);

  const toggleCompletion = (type, index) => {
    setCompletedItems(prev => ({
      ...prev,
      [type]: prev[type].includes(index)
        ? prev[type].filter(i => i !== index)
        : [...prev[type], index]
    }));
  };

  const getTotalProgress = () => {
    if (!unitData) return 0;
    
    const totalItems = 
      (unitData.videos?.length || 0) +
      (unitData.pdfs?.length || 0) +
      (unitData.assignments?.length || 0) +
      (unitData.quizzes?.length || 0);
    
    const completedCount = 
      completedItems.videos.length +
      completedItems.pdfs.length +
      completedItems.assignments.length +
      completedItems.quizzes.length;
    
    return totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  };

  if (!subjectData || !unitData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl mb-4">Content not found!</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progress = getTotalProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center text-white mb-4 hover:text-gray-200 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Units
          </motion.button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {unitData.title}
              </h1>
              <p className="text-blue-100">
                {subjectData.name} • Unit {parseInt(unitIndex) + 1}
              </p>
            </div>

            <div className="flex items-stretch gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="text-white text-sm mb-2">Your Progress</div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 w-32 bg-white/20 rounded-full h-2">
                    <motion.div
                      className="h-2 bg-green-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-white font-bold text-lg">{progress}%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('quizzes');
                  setTimeout(() => {
                    if (contentTopRef.current) contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="px-5 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-md"
              >
                <Trophy className="h-5 w-5" />
                <span>Take Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

  <div ref={contentTopRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player Section */}
        {currentVideo && (
          <motion.div
            className="mb-8 bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="aspect-video bg-black flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
              <div className="relative z-10 text-center">
                <PlayCircle className="h-20 w-20 text-white mb-4 mx-auto" />
                <p className="text-white text-xl mb-2">{currentVideo.title}</p>
                <p className="text-gray-300 text-sm mb-4">Duration: {currentVideo.duration}</p>
                <a
                  href={currentVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                >
                  <Play className="h-5 w-5" />
                  <span>Watch on YouTube</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="p-4 bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{currentVideo.title}</h3>
                  <p className="text-gray-400 text-sm">{currentVideo.description}</p>
                </div>
                <button
                  onClick={() => toggleCompletion('videos', unitData.videos.indexOf(currentVideo))}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    completedItems.videos.includes(unitData.videos.indexOf(currentVideo))
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{completedItems.videos.includes(unitData.videos.indexOf(currentVideo)) ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="bg-gray-800 rounded-xl p-2 mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'videos'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Video className="h-5 w-5" />
            <span className="font-medium">Videos ({unitData.videos?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('pdfs')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'pdfs'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">PDFs ({unitData.pdfs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'assignments'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="font-medium">Assignments ({unitData.assignments?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'quizzes'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Quizzes ({unitData.quizzes?.length || 0})</span>
          </button>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {unitData.videos && unitData.videos.length > 0 ? (
                unitData.videos.map((video, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div 
                      className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative cursor-pointer"
                      onClick={() => setCurrentVideo(video)}
                    >
                      <PlayCircle className="h-16 w-16 text-white" />
                      {completedItems.videos.includes(index) && (
                        <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{video.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-gray-500">{video.duration}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-center font-medium text-sm flex items-center justify-center space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Play className="h-4 w-4" />
                          <span>Watch</span>
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompletion('videos', index);
                          }}
                          className={`px-3 py-2 rounded text-sm ${
                            completedItems.videos.includes(index)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {completedItems.videos.includes(index) ? '✓' : 'Done'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No videos available for this unit yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* PDFs Tab */}
          {activeTab === 'pdfs' && (
            <motion.div
              key="pdfs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {unitData.pdfs && unitData.pdfs.length > 0 ? (
                unitData.pdfs.map((pdf, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-3 bg-green-600 rounded-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-2">{pdf.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{pdf.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{pdf.pages} pages</span>
                            <span>•</span>
                            <span>{pdf.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <a
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </a>
                        <button
                          onClick={() => toggleCompletion('pdfs', index)}
                          className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm ${
                            completedItems.pdfs.includes(index)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>{completedItems.pdfs.includes(index) ? 'Read' : 'Mark Read'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-800 rounded-xl">
                  <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No PDF resources available for this unit yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {unitData.assignments && unitData.assignments.length > 0 ? (
                unitData.assignments.map((assignment, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-purple-600 rounded-lg">
                          <ClipboardList className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{assignment.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{assignment.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Due Date:</span>
                        <span className="text-white">{assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Max Score:</span>
                        <span className="text-white">{assignment.maxScore} points</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Difficulty:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          assignment.difficulty === 'Easy' ? 'bg-green-600' :
                          assignment.difficulty === 'Medium' ? 'bg-yellow-600' :
                          'bg-red-600'
                        } text-white`}>
                          {assignment.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium">
                        Start Assignment
                      </button>
                      <button
                        onClick={() => toggleCompletion('assignments', index)}
                        className={`px-4 py-2 rounded-lg ${
                          completedItems.assignments.includes(index)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-800 rounded-xl">
                  <ClipboardList className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No assignments available for this unit yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <motion.div
              key="quizzes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {unitData.quizzes && unitData.quizzes.length > 0 ? (
                unitData.quizzes.map((quiz, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-600 rounded-lg">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      {completedItems.quizzes.includes(index) && (
                        <div className="bg-green-600 rounded-full p-1">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-white font-semibold text-lg mb-2">{quiz.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{quiz.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Questions:</span>
                        <span className="text-white">{quiz.questions}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{quiz.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Passing Score:</span>
                        <span className="text-white">{quiz.passingScore}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCompletion('quizzes', index)}
                      className={`w-full px-4 py-2 rounded-lg font-medium ${
                        completedItems.quizzes.includes(index)
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {completedItems.quizzes.includes(index) ? 'Completed' : 'Take Quiz'}
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-800 rounded-xl">
                  <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No quizzes available for this unit yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UnitContent;
