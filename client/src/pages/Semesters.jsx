import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Calendar, Users, Clock, Download, Play, CheckCircle, Award, Target } from 'lucide-react'
import semesterData from '../data/semesterData.json'

const Semesters = () => {
  const { branch } = useParams()
  const navigate = useNavigate()
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [branchData, setBranchData] = useState(null)

  // Use imported JSON data
  const branchSyllabusData = semesterData.branches

  useEffect(() => {
    const data = branchSyllabusData[branch]
    if (data) {
      setBranchData(data)
    }
  }, [branch])

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-blue-600 to-indigo-600',
        accent: 'text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-700',
        border: 'border-blue-500/30',
        card: 'bg-blue-900/20'
      },
      purple: {
        bg: 'from-purple-600 to-violet-600',
        accent: 'text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-700',
        border: 'border-purple-500/30',
        card: 'bg-purple-900/20'
      },
      green: {
        bg: 'from-green-600 to-teal-600',
        accent: 'text-green-400',
        button: 'bg-green-600 hover:bg-green-700',
        border: 'border-green-500/30',
        card: 'bg-green-900/20'
      }
    }
    return colors[color] || colors.blue
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (!branchData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">
          <div className="text-xl mb-4">Branch not found!</div>
          <div className="text-sm">Looking for: {branch}</div>
          <div className="text-sm mt-2">Available branches:</div>
          <ul className="text-xs mt-2">
            {Object.keys(branchSyllabusData).map(key => (
              <li key={key} className="text-gray-300">- {key}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const colorClasses = getColorClasses(branchData.color)
  const currentSemester = branchData.semesters[selectedSemester]

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800'>
      {/* Header */}
      <motion.div 
        className={`relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${colorClasses.bg} shadow-2xl`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className='max-w-7xl mx-auto'>
          <motion.button
            onClick={() => navigate('/content')}
            className="flex items-center text-white mb-6 hover:text-gray-200 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Branches
          </motion.button>

          <motion.div 
            className='text-center'
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className='text-4xl sm:text-5xl font-extrabold text-white mb-4'>
              {branchData.name}
            </h1>
            <p className='max-w-2xl mx-auto text-xl text-gray-200 mb-8'>
              Select a semester to explore subjects and syllabus
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Semester Selection */}
        <motion.div 
          className="mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className={`text-2xl font-bold text-white mb-6 flex items-center ${colorClasses.accent}`}>
            <Calendar className="h-6 w-6 mr-2" />
            Choose Semester
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Array.from({ length: branchData.totalSemesters }, (_, i) => i + 1).map((sem) => (
              <motion.button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                  selectedSemester === sem
                    ? `${colorClasses.button} text-white shadow-lg scale-105`
                    : `bg-gray-800 text-gray-300 hover:bg-gray-700 border ${colorClasses.border}`
                }`}
                whileHover={{ scale: selectedSemester === sem ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={fadeInUp}
              >
                Sem {sem}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Selected Semester Details */}
        {currentSemester && (
          <motion.div
            key={selectedSemester}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-white">
                {currentSemester.name}
              </h3>
              <div className="flex space-x-4">
                <motion.button
                  className={`${colorClasses.button} text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Syllabus</span>
                </motion.button>
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSemester.subjects.map((subject, index) => (
                <motion.div
                  key={subject.code}
                  className={`${colorClasses.card} backdrop-blur-lg border ${colorClasses.border} rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300`}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => navigate(`/subjects/${branch}/${selectedSemester}/${subject.code}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 ${colorClasses.button} rounded-lg`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      subject.type === 'Core' 
                        ? 'bg-green-600/30 text-green-300 border border-green-500/50' 
                        : 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/50'
                    }`}>
                      {subject.type}
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold text-white mb-2">
                    {subject.name}
                  </h4>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    Course Code: {subject.code}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{subject.credits} Credits</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>4 hrs/week</span>
                      </div>
                    </div>
                    
                    <motion.button
                      className="text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-600/30">
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                      <div className={`h-1.5 ${colorClasses.button} rounded-full`} style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Semester Summary */}
            <motion.div
              className={`mt-12 ${colorClasses.card} backdrop-blur-lg border ${colorClasses.border} rounded-xl p-6`}
              variants={fadeInUp}
            >
              <h4 className="text-xl font-semibold text-white mb-4">Semester Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${colorClasses.accent}`}>
                    {currentSemester.subjects.length}
                  </div>
                  <div className="text-gray-400 text-sm">Total Subjects</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${colorClasses.accent}`}>
                    {currentSemester.subjects.reduce((sum, subject) => sum + subject.credits, 0)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Credits</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${colorClasses.accent}`}>
                    {currentSemester.subjects.filter(s => s.type === 'Core').length}
                  </div>
                  <div className="text-gray-400 text-sm">Core Subjects</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${colorClasses.accent}`}>
                    {currentSemester.subjects.filter(s => s.type === 'Elective').length}
                  </div>
                  <div className="text-gray-400 text-sm">Electives</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Semesters