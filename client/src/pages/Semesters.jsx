import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, Users, Clock, Download, Play, CheckCircle, Award, Target, ChevronRight } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const Semesters = () => {
  const { branch } = useParams();
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [branchData, setBranchData] = useState(null);

  const branchSyllabusData = semesterData.branches;

  useEffect(() => {
    const data = branchSyllabusData[branch];
    if (data) {
      setBranchData(data);
    }
  }, [branch, branchSyllabusData]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  if (!branchData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Branch Not Found</h1>
          <p className="text-gray-400">Could not find data for "{branch}".</p>
          <button
            onClick={() => navigate('/content')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Back to Content
          </button>
        </div>
      </div>
    );
  }

  const currentSemester = branchData.semesters[selectedSemester];

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/content/branches')}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>
              <div>
                <h1 className='text-xl font-bold text-white'>{branchData.name}</h1>
                <p className="text-sm text-gray-400">Semester {selectedSemester}</p>
              </div>
            </div>
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span>Syllabus</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Semester Selection Tabs */}
        <motion.div className="mb-8" variants={fadeInUp} initial="hidden" animate="visible">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {Array.from({ length: branchData.totalSemesters }, (_, i) => i + 1).map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedSemester === sem
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  }`}
                >
                  Semester {sem}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Semester Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSemester}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentSemester && (
              <>
                {/* Summary Cards */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <StatCard
                    icon={<BookOpen />}
                    label="Total Subjects"
                    value={currentSemester.subjects.length}
                    color="blue"
                  />
                  <StatCard
                    icon={<Award />}
                    label="Total Credits"
                    value={currentSemester.subjects.reduce((sum, subject) => sum + subject.credits, 0)}
                    color="green"
                  />
                  <StatCard
                    icon={<Target />}
                    label="Core Subjects"
                    value={currentSemester.subjects.filter(s => s.type === 'Core').length}
                    color="purple"
                  />
                  <StatCard
                    icon={<Users />}
                    label="Electives"
                    value={currentSemester.subjects.filter(s => s.type === 'Elective').length}
                    color="yellow"
                  />
                </motion.div>

                {/* Subjects List */}
                <motion.div
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Subjects</h3>
                  </div>
                  <ul className="divide-y divide-gray-700/50">
                    {currentSemester.subjects.map((subject) => (
                      <SubjectListItem
                        key={subject.code}
                        subject={subject}
                        branch={branch}
                        semester={selectedSemester}
                        navigate={navigate}
                      />
                    ))}
                  </ul>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-900/50 text-blue-400',
    green: 'bg-green-900/50 text-green-400',
    purple: 'bg-purple-900/50 text-purple-400',
    yellow: 'bg-yellow-900/50 text-yellow-400',
  };

  return (
    <motion.div
      className={`p-4 rounded-lg ${colors[color]}`}
      variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </motion.div>
  );
};

const SubjectListItem = ({ subject, branch, semester, navigate }) => (
  <motion.li
    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
    whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
    className="p-4 cursor-pointer"
    onClick={() => navigate(`/subjects/${branch}/${semester}/${subject.code}`)}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-gray-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white">{subject.name}</h4>
          <p className="text-sm text-gray-400">Code: {subject.code} &bull; {subject.credits} Credits</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          subject.type === 'Core'
            ? 'bg-green-900/70 text-green-300'
            : 'bg-yellow-900/70 text-yellow-300'
        }`}>
          {subject.type}
        </span>
        <ChevronRight className="h-5 w-5 text-gray-500" />
      </div>
    </div>
  </motion.li>
);

export default Semesters;