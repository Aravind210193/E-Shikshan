import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Clock, Users, Play, FileText, Download, CheckCircle2, Circle } from 'lucide-react'
import semesterData from '../data/semesterData.json'

const SubjectUnits = () => {
  const { branch, semester, subjectCode } = useParams()
  const navigate = useNavigate()
  const [subjectData, setSubjectData] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [completedUnits, setCompletedUnits] = useState([])

  const branchSyllabusData = semesterData.branches

  useEffect(() => {
    const branch_data = branchSyllabusData[branch]
    if (branch_data && branch_data.semesters[semester]) {
      setBranchData(branch_data)
      const subject = branch_data.semesters[semester].subjects.find(
        s => s.code === subjectCode
      )
      setSubjectData(subject)
    }
  }, [branch, semester, subjectCode])

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

  const toggleUnitCompletion = (unitIndex) => {
    setCompletedUnits(prev => 
      prev.includes(unitIndex) 
        ? prev.filter(i => i !== unitIndex)
        : [...prev, unitIndex]
    )
  }

  if (!subjectData || !branchData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl mb-4">Subject not found!</div>
          <div className="text-sm">Looking for: {subjectCode} in {branch} semester {semester}</div>
        </div>
      </div>
    )
  }

  const colorClasses = getColorClasses(branchData.color)
  const totalHours = subjectData.units?.reduce((sum, unit) => sum + unit.hours, 0) || 0
  const completionPercentage = subjectData.units ? Math.round((completedUnits.length / subjectData.units.length) * 100) : 0

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
            onClick={() => navigate(`/content/${branch}`)}
            className="flex items-center text-white mb-6 hover:text-gray-200 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Semesters
          </motion.button>

          <motion.div 
            className='text-center'
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-4">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                {branchData.shortName} • Semester {semester}
              </span>
            </div>
            <h1 className='text-4xl sm:text-5xl font-extrabold text-white mb-4'>
              {subjectData.name}
            </h1>
            <p className='max-w-2xl mx-auto text-xl text-gray-200 mb-8'>
              Course Code: {subjectData.code} • {subjectData.credits} Credits • {subjectData.difficulty} Level
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Subject Overview */}
        <motion.div
          className={`mb-12 ${colorClasses.card} backdrop-blur-lg border ${colorClasses.border} rounded-xl p-6`}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Subject Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className={`text-3xl font-bold ${colorClasses.accent} mb-2`}>
                {subjectData.units?.length || 0}
              </div>
              <div className="text-gray-400 text-sm">Total Units</div>
            </div>
            <div>
              <div className={`text-3xl font-bold ${colorClasses.accent} mb-2`}>
                {totalHours}
              </div>
              <div className="text-gray-400 text-sm">Total Hours</div>
            </div>
            <div>
              <div className={`text-3xl font-bold ${colorClasses.accent} mb-2`}>
                {completionPercentage}%
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div>
              <div className={`text-3xl font-bold ${colorClasses.accent} mb-2`}>
                {subjectData.type}
              </div>
              <div className="text-gray-400 text-sm">Subject Type</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <motion.div 
                className={`h-2 ${colorClasses.button} rounded-full`} 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Units Section */}
        {subjectData.units && subjectData.units.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className={`text-3xl font-bold text-white mb-8 flex items-center ${colorClasses.accent}`}
              variants={fadeInUp}
            >
              <BookOpen className="h-8 w-8 mr-3" />
              Course Units
            </motion.h2>

            <div className="space-y-6">
              {subjectData.units.map((unit, index) => (
                <motion.div
                  key={index}
                  className={`${colorClasses.card} backdrop-blur-lg border ${colorClasses.border} rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300`}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  onClick={() => toggleUnitCompletion(index)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 ${colorClasses.button} rounded-lg flex-shrink-0`}>
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {unit.title}
                          </h3>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center text-gray-400 text-sm">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{unit.hours} hours</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={completedUnits.includes(index) ? 'text-green-400' : 'text-gray-400'}
                            >
                              {completedUnits.includes(index) ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : (
                                <Circle className="h-6 w-6" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Topics Covered:</h4>
                          <div className="flex flex-wrap gap-2">
                            {unit.topics.map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600/30"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-600/30">
                    <div className="flex space-x-4">
                      <motion.button
                        className={`${colorClasses.button} text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="h-4 w-4" />
                        <span>Start Learning</span>
                      </motion.button>
                      
                      <motion.button
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="h-4 w-4" />
                        <span>Resources</span>
                      </motion.button>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Unit {index + 1} of {subjectData.units.length}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className={`${colorClasses.card} backdrop-blur-lg border ${colorClasses.border} rounded-xl p-12 text-center`}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Units Not Available</h3>
            <p className="text-gray-400">
              Detailed unit breakdown for this subject will be available soon.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SubjectUnits