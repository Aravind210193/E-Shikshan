import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Video, FileText, Play, Download, ExternalLink, Award, Clock } from 'lucide-react';
import semesterData from '../data/semesterData.json';
import semesterDataMedical from '../data/semesterDataMedical.json';

const SubjectDetail = () => {
  const { branch, semester, code } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [branchData, setBranchData] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    // Merge both semester data sources
    const allBranches = {
      ...(semesterData.branches || {}),
      ...(semesterDataMedical.branches || {})
    };

    const branchInfo = allBranches[branch];
    if (branchInfo && branchInfo.semesters && branchInfo.semesters[semester]) {
      setBranchData(branchInfo);
      const subjectInfo = branchInfo.semesters[semester].subjects.find(s => s.code === code);
      setSubject(subjectInfo);
    }
  }, [branch, semester, code]);

  if (!subject || !branchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const hasVideos = subject.videos && subject.videos.length > 0;
  const hasPdfs = subject.pdfs && subject.pdfs.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/semesters/${branch}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Semesters</span>
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Award size={16} />
                  {subject.code}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {subject.credits} Credits
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subject.type === 'Core'
                    ? 'bg-green-900/70 text-green-300'
                    : 'bg-yellow-900/70 text-yellow-300'
                }`}>
                  {subject.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subject.difficulty === 'Easy'
                    ? 'bg-green-900/70 text-green-300'
                    : subject.difficulty === 'Medium'
                    ? 'bg-yellow-900/70 text-yellow-300'
                    : 'bg-red-900/70 text-red-300'
                }`}>
                  {subject.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-700/30"
          >
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{hasVideos ? subject.videos.length : 0}</div>
                <div className="text-sm text-gray-400">Video Lectures</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-700/30"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{hasPdfs ? subject.pdfs.length : 0}</div>
                <div className="text-sm text-gray-400">PDF Resources</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-700/30"
          >
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold">{subject.credits}</div>
                <div className="text-sm text-gray-400">Credit Points</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-700/50">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Video size={20} />
              Video Lectures ({hasVideos ? subject.videos.length : 0})
            </button>
            <button
              onClick={() => setActiveTab('pdfs')}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'pdfs'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <FileText size={20} />
              PDF Resources ({hasPdfs ? subject.pdfs.length : 0})
            </button>
          </div>

          <div className="p-6">
            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="space-y-4">
                {hasVideos ? (
                  subject.videos.map((video, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                            <Play className="h-6 w-6 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{video.title}</h3>
                            <p className="text-sm text-gray-400">Duration: {video.duration}</p>
                          </div>
                        </div>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Watch
                        </a>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No video lectures available yet</p>
                  </div>
                )}
              </div>
            )}

            {/* PDFs Tab */}
            {activeTab === 'pdfs' && (
              <div className="space-y-4">
                {hasPdfs ? (
                  subject.pdfs.map((pdf, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                            <FileText className="h-6 w-6 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{pdf.title}</h3>
                          </div>
                        </div>
                        <a
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No PDF resources available yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
