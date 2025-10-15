import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Target, CheckCircle, GraduationCap, Star, Award, Users, BookMarked, FileText, Download, Eye, PlayCircle, Brain, Zap, Microscope, TrendingUp, Database, Code2, Share2, MessageCircle, Search, X } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const PostGraduateSubjects = () => {
  const { program, specialization, semester } = useParams();
  const [completedUnits, setCompletedUnits] = useState(new Set());
  const [expandedUnits, setExpandedUnits] = useState(new Set());
  const [selectedPdf, setSelectedPdf] = useState(null);

  const pgData = semesterData.postgraduate;
  const currentProgram = pgData?.programs?.[program];
  
  let currentSemester;
  if (program === 'mba') {
    currentSemester = currentProgram?.semesters?.[semester];
  } else if (currentProgram?.specializations) {
    currentSemester = currentProgram.specializations?.[specialization]?.semesters?.[semester];
  }

  if (!currentSemester) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Program or Semester not found</h2>
          <Link to="/content" className="text-red-400 hover:text-red-300">
            Back to Courses
          </Link>
          <div className="mt-4 text-gray-400">
            <p>Available programs: MBA, M.Tech, M.Sc</p>
            <p>Available specializations for M.Tech: Computer Science</p>
            <p>Available specializations for M.Sc: Physics</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleUnitComplete = (subjectCode, unitIndex) => {
    const unitKey = `${subjectCode}-${unitIndex}`;
    const newCompleted = new Set(completedUnits);
    if (newCompleted.has(unitKey)) {
      newCompleted.delete(unitKey);
    } else {
      newCompleted.add(unitKey);
    }
    setCompletedUnits(newCompleted);
  };

  const toggleUnitExpand = (subjectCode, unitIndex) => {
    const unitKey = `${subjectCode}-${unitIndex}`;
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitKey)) {
      newExpanded.delete(unitKey);
    } else {
      newExpanded.add(unitKey);
    }
    setExpandedUnits(newExpanded);
  };

  const generatePostGraduatePdfResources = (subject, unit, unitIndex, program, specialization) => {
    // Generate advanced research-level PDF resources
    const baseResources = [
      { 
        name: `${unit.title} - Research Papers & Publications`, 
        type: 'research', 
        size: `${(Math.random() * 5 + 3).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 40) + 25,
        difficulty: 'Research Level',
        category: 'Academic'
      },
      { 
        name: `${unit.title} - Advanced Theory & Analysis`, 
        type: 'theory', 
        size: `${(Math.random() * 4 + 2.5).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 35) + 20,
        difficulty: 'Advanced',
        category: 'Theoretical'
      },
      { 
        name: `${unit.title} - Case Studies & Applications`, 
        type: 'cases', 
        size: `${(Math.random() * 3 + 2).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 25) + 15,
        difficulty: 'Applied Research',
        category: 'Practical'
      },
      { 
        name: `${unit.title} - Industry Best Practices`, 
        type: 'industry', 
        size: `${(Math.random() * 3.5 + 1.5).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 30) + 12,
        difficulty: 'Professional',
        category: 'Industry'
      }
    ];

    // Add program-specific advanced resources
    if (program === 'mtech' || specialization === 'computer-science') {
      baseResources.push({
        name: `${unit.title} - Algorithm Implementation & Code`,
        type: 'code',
        size: `${(Math.random() * 2.5 + 1).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 20) + 10,
        difficulty: 'Implementation',
        category: 'Technical'
      });
    } else if (program === 'mba') {
      baseResources.push({
        name: `${unit.title} - Strategic Framework & Models`,
        type: 'framework',
        size: `${(Math.random() * 3 + 1.8).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 22) + 12,
        difficulty: 'Strategic',
        category: 'Management'
      });
    }
    
    return baseResources.slice(0, 4 + Math.floor(Math.random() * 2));
  };

  const getProgramColor = (programName) => {
    switch(programName) {
      case 'mba': return 'from-red-600 to-pink-600';
      case 'mtech': return 'from-indigo-600 to-purple-600';
      case 'msc': return 'from-green-600 to-teal-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getProgramTitle = () => {
    if (program === 'mba') return currentProgram.name;
    if (specialization) {
      return `${currentProgram.name} - ${currentProgram.specializations[specialization].name}`;
    }
    return currentProgram.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getProgramColor(program)} px-6 py-8`}>
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/content" 
            className="inline-flex items-center text-white hover:text-gray-200 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Education Levels
          </Link>
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {currentSemester.name}
              </h1>
              <p className="text-gray-100 text-lg">
                {getProgramTitle()}
              </p>
            </div>
          </div>
          <p className="text-gray-200">
            Advanced postgraduate studies with research and specialization focus
          </p>
        </div>
      </div>

      {/* Program Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-4">
            <Link 
              to={`/postgraduate/mba//${semester}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                program === 'mba' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              MBA Program
            </Link>
            <Link 
              to={`/postgraduate/mtech/computer-science/${semester}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                program === 'mtech' && specialization === 'computer-science' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              M.Tech CS
            </Link>
            <Link 
              to={`/postgraduate/msc/physics/${semester}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                program === 'msc' && specialization === 'physics' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              M.Sc Physics
            </Link>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {currentSemester.subjects.map((subject, index) => (
            <motion.div
              key={subject.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-all duration-300 shadow-xl"
            >
              {/* Subject Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                  <p className="text-gray-400 text-sm">{subject.code}</p>
                </div>
                <div className="flex items-center space-x-2 text-red-400">
                  <BookMarked className="h-5 w-5" />
                  <span className="text-sm">{subject.credits} Credits</span>
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subject.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
                  subject.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                  'bg-red-900 text-red-200'
                }`}>
                  {subject.difficulty}
                </span>
                <span className="text-gray-400 text-sm">{subject.type}</span>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>

              {/* Units */}
              <div className="space-y-3">
                <h4 className="text-red-400 font-semibold mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Advanced Units & Topics ({subject.units.length} modules)
                </h4>
                {subject.units.map((unit, unitIndex) => {
                  const unitKey = `${subject.code}-${unitIndex}`;
                  const isCompleted = completedUnits.has(unitKey);
                  const isExpanded = expandedUnits.has(unitKey);
                  const pdfResources = generatePostGraduatePdfResources(subject, unit, unitIndex, program, specialization);
                  
                  return (
                    <motion.div 
                      key={unitIndex} 
                      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -2 }}
                      layout
                    >
                      {/* Advanced Unit Header */}
                      <div className="p-5 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-bl-full"></div>
                        
                        <div className="flex items-start justify-between mb-3 relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-white font-semibold text-base leading-tight">{unit.title}</h5>
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => toggleUnitExpand(subject.code, unitIndex)}
                                  className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-500/20"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FileText className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  onClick={() => toggleUnitComplete(subject.code, unitIndex)}
                                  className={`${isCompleted ? 'text-red-400' : 'text-gray-500'} hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-500/20`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <CheckCircle className={`h-5 w-5 ${isCompleted ? 'fill-current' : ''}`} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-400 text-sm mb-4 space-x-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {unit.hours} hours research
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {pdfResources.length} resources
                          </div>
                          <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-1" />
                            Advanced Level
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {unit.topics.slice(0, 3).map((topic, idx) => (
                            <motion.span 
                              key={idx} 
                              className="bg-gradient-to-r from-red-900/40 to-pink-900/40 text-red-300 text-sm px-3 py-1 rounded-full border border-red-500/30"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              {topic}
                            </motion.span>
                          ))}
                          {unit.topics.length > 3 && (
                            <span className="text-gray-400 text-sm px-3 py-1 bg-gray-700/50 rounded-full">
                              +{unit.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Advanced Research Resources Section */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="border-t border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900"
                        >
                          <div className="p-5">
                            <h6 className="text-red-400 font-semibold text-base mb-4 flex items-center">
                              <BookOpen className="h-5 w-5 mr-2" />
                              Research Materials & Advanced Resources
                            </h6>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                              {pdfResources.map((resource, idx) => (
                                <motion.div 
                                  key={idx} 
                                  className="flex items-center justify-between bg-gray-900 rounded-xl p-4 border border-gray-600 hover:border-red-500/50 transition-all duration-300"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${
                                      resource.category === 'Academic' ? 'bg-blue-600' :
                                      resource.category === 'Theoretical' ? 'bg-purple-600' :
                                      resource.category === 'Practical' ? 'bg-green-600' :
                                      resource.category === 'Industry' ? 'bg-orange-600' :
                                      resource.category === 'Technical' ? 'bg-indigo-600' :
                                      'bg-red-600'
                                    } shadow-lg`}>
                                      {resource.type === 'research' ? <Microscope className="h-5 w-5 text-white" /> :
                                       resource.type === 'code' ? <Code2 className="h-5 w-5 text-white" /> :
                                       resource.type === 'framework' ? <TrendingUp className="h-5 w-5 text-white" /> :
                                       resource.type === 'industry' ? <Zap className="h-5 w-5 text-white" /> :
                                       <FileText className="h-5 w-5 text-white" />}
                                    </div>
                                    <div>
                                      <p className="text-white text-sm font-semibold leading-tight">{resource.name}</p>
                                      <div className="flex items-center space-x-3 mt-1">
                                        <p className="text-gray-400 text-xs">
                                          {resource.size} • {resource.pages} pages
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          resource.difficulty === 'Research Level' ? 'bg-red-600/20 text-red-300' :
                                          resource.difficulty === 'Advanced' ? 'bg-purple-600/20 text-purple-300' :
                                          resource.difficulty === 'Professional' ? 'bg-blue-600/20 text-blue-300' :
                                          'bg-gray-600/20 text-gray-300'
                                        }`}>
                                          {resource.difficulty}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <motion.button
                                      onClick={() => setSelectedPdf(resource)}
                                      className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-lg transition-colors shadow-lg"
                                      title="View Research Material"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </motion.button>
                                    <motion.button
                                      className="bg-gray-600 hover:bg-gray-700 text-white p-2.5 rounded-lg transition-colors shadow-lg"
                                      title="Download Resource"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Download className="h-4 w-4" />
                                    </motion.button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Advanced Learning Tools & Research Features */}
                            <div className="pt-4 border-t border-gray-700">
                              <p className="text-gray-400 text-sm mb-3 font-medium">Research & Advanced Tools:</p>
                              <div className="flex flex-wrap gap-2">
                                {program === 'mtech' && (
                                  <>
                                    <motion.button 
                                      className="bg-indigo-600 bg-opacity-20 text-indigo-300 text-sm px-4 py-2 rounded-full hover:bg-opacity-30 transition-colors flex items-center border border-indigo-500/30"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <Code2 className="h-4 w-4 mr-2" />
                                      Code Repository
                                    </motion.button>
                                    <motion.button 
                                      className="bg-green-600 bg-opacity-20 text-green-300 text-sm px-4 py-2 rounded-full hover:bg-opacity-30 transition-colors flex items-center border border-green-500/30"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <Database className="h-4 w-4 mr-2" />
                                      Datasets
                                    </motion.button>
                                  </>
                                )}
                                {program === 'mba' && (
                                  <>
                                    <motion.button 
                                      className="bg-purple-600 bg-opacity-20 text-purple-300 text-sm px-4 py-2 rounded-full hover:bg-opacity-30 transition-colors border border-purple-500/30"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      Strategic Models
                                    </motion.button>
                                    <motion.button 
                                      className="bg-yellow-600 bg-opacity-20 text-yellow-300 text-sm px-4 py-2 rounded-full hover:bg-opacity-30 transition-colors border border-yellow-500/30"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      Business Simulator
                                    </motion.button>
                                  </>
                                )}
                                <motion.button 
                                  className="bg-red-600 bg-opacity-20 text-red-300 text-sm px-4 py-2 rounded-full hover:bg-opacity-30 transition-colors flex items-center border border-red-500/30"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Expert Lectures
                                </motion.button>
                                <motion.button 
                                  className="bg-blue-600 bg-opacity-20 text-blue-300 text-sm px-4 py-2 rounded-full hover:bg-opacity-30 transition-colors flex items-center border border-blue-500/30"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Microscope className="h-4 w-4 mr-2" />
                                  Research Papers
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Completion Progress</span>
                  <span>
                    {subject.units.filter((_, idx) => completedUnits.has(`${subject.code}-${idx}`)).length} / {subject.units.length} modules
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(subject.units.filter((_, idx) => completedUnits.has(`${subject.code}-${idx}`)).length / subject.units.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Study Hours and Credits */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex justify-between text-center">
                  <div>
                    <div className="text-lg font-bold text-red-400">
                      {subject.units.reduce((total, unit) => total + unit.hours, 0)}
                    </div>
                    <div className="text-gray-400 text-xs">Study Hours</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-400">
                      {subject.credits}
                    </div>
                    <div className="text-gray-400 text-xs">Credits</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Program Statistics */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-red-400" />
            Program Overview - {getProgramTitle()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center bg-gray-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {currentSemester.subjects.length}
              </div>
              <div className="text-gray-400">Advanced Courses</div>
            </div>
            <div className="text-center bg-gray-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {currentSemester.subjects.reduce((total, subject) => total + subject.units.length, 0)}
              </div>
              <div className="text-gray-400">Research Modules</div>
            </div>
            <div className="text-center bg-gray-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {currentSemester.subjects.reduce((total, subject) => total + subject.credits, 0)}
              </div>
              <div className="text-gray-400">Total Credits</div>
            </div>
            <div className="text-center bg-gray-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {currentSemester.subjects.reduce((total, subject) => total + subject.units.reduce((unitTotal, unit) => unitTotal + unit.hours, 0), 0)}
              </div>
              <div className="text-gray-400">Study Hours</div>
            </div>
          </div>
          
          {/* Additional Program Info */}
          <div className="mt-4 p-4 bg-gray-900 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Key Features:</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Research-oriented curriculum with practical applications</li>
              <li>• Industry collaboration and internship opportunities</li>
              <li>• Advanced laboratory sessions and project work</li>
              <li>• Seminar presentations and thesis preparation</li>
              <li>• Guest lectures from industry experts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advanced PDF Viewer Modal for PostGraduate */}
      {selectedPdf && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPdf(null)}
        >
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col border border-gray-700"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Advanced Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-white/20 shadow-lg`}>
                  {selectedPdf.type === 'research' ? <Microscope className="h-6 w-6" /> :
                   selectedPdf.type === 'code' ? <Code2 className="h-6 w-6" /> :
                   selectedPdf.type === 'framework' ? <TrendingUp className="h-6 w-6" /> :
                   selectedPdf.type === 'industry' ? <Zap className="h-6 w-6" /> :
                   <FileText className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedPdf.name}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-white/90 text-sm">{selectedPdf.size} • {selectedPdf.pages} pages</p>
                    <span className={`text-xs px-3 py-1 rounded-full bg-white/20 ${
                      selectedPdf.difficulty === 'Research Level' ? 'text-white' :
                      selectedPdf.difficulty === 'Advanced' ? 'text-white/90' :
                      'text-white/80'
                    }`}>
                      {selectedPdf.difficulty}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/20 text-white/90">
                      {selectedPdf.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-lg transition-colors"
                  title="Download Resource"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-5 w-5" />
                </motion.button>
                <motion.button
                  className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-lg transition-colors"
                  title="Share Resource"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={() => setSelectedPdf(null)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Advanced Content Display */}
            <div className="flex-1 flex bg-gray-100">
              {/* PDF Viewer Area */}
              <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-200">
                <div className="text-center">
                  <motion.div
                    className="bg-white rounded-xl p-8 shadow-xl border-2 border-dashed border-gray-300 max-w-lg"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className={`p-4 rounded-xl mb-4 ${
                      selectedPdf.type === 'research' ? 'bg-blue-100' :
                      selectedPdf.type === 'code' ? 'bg-indigo-100' :
                      selectedPdf.type === 'framework' ? 'bg-purple-100' :
                      selectedPdf.type === 'industry' ? 'bg-orange-100' :
                      'bg-gray-100'
                    } mx-auto w-fit`}>
                      {selectedPdf.type === 'research' ? <Microscope className="h-12 w-12 text-blue-600" /> :
                       selectedPdf.type === 'code' ? <Code2 className="h-12 w-12 text-indigo-600" /> :
                       selectedPdf.type === 'framework' ? <TrendingUp className="h-12 w-12 text-purple-600" /> :
                       selectedPdf.type === 'industry' ? <Zap className="h-12 w-12 text-orange-600" /> :
                       <FileText className="h-12 w-12 text-gray-600" />}
                    </div>
                    
                    <h4 className="text-gray-800 text-xl font-bold mb-2">Research Material Viewer</h4>
                    <p className="text-gray-600 mb-4">Advanced academic content for postgraduate studies</p>
                    <p className="text-gray-500 text-sm mb-6">In production, this would display the {selectedPdf.type} content with interactive features</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button 
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-medium shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download className="h-4 w-4 mr-2 inline" />
                        Download
                      </motion.button>
                      <motion.button 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-medium shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Eye className="h-4 w-4 mr-2 inline" />
                        Full View
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Research Tools Sidebar */}
              <div className="w-80 lg:w-96 xl:w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto hidden md:block">
                <h4 className="text-white font-bold text-lg mb-6 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-red-400" />
                  Research Tools
                </h4>
                
                <div className="space-y-6">
                  {/* Research Features */}
                  <div>
                    <p className="text-gray-300 font-medium mb-3 text-sm">Academic Features:</p>
                    <div className="space-y-2">
                      <motion.button className="w-full text-left bg-gray-800 hover:bg-gray-750 p-3 rounded-lg text-white text-sm transition-colors border border-gray-700 hover:border-gray-600">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-3 text-blue-400" />
                          Citation Generator
                        </div>
                      </motion.button>
                      <motion.button className="w-full text-left bg-gray-800 hover:bg-gray-750 p-3 rounded-lg text-white text-sm transition-colors border border-gray-700 hover:border-gray-600">
                        <div className="flex items-center">
                          <Search className="h-4 w-4 mr-3 text-green-400" />
                          Reference Finder
                        </div>
                      </motion.button>
                      <motion.button className="w-full text-left bg-gray-800 hover:bg-gray-750 p-3 rounded-lg text-white text-sm transition-colors border border-gray-700 hover:border-gray-600">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-3 text-purple-400" />
                          Research Database
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Collaboration Tools */}
                  <div>
                    <p className="text-gray-300 font-medium mb-3 text-sm">Collaboration:</p>
                    <div className="space-y-2">
                      <motion.button className="w-full text-left bg-gray-800 hover:bg-gray-750 p-3 rounded-lg text-white text-sm transition-colors border border-gray-700 hover:border-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-3 text-yellow-400" />
                          Study Groups
                        </div>
                      </motion.button>
                      <motion.button className="w-full text-left bg-gray-800 hover:bg-gray-750 p-3 rounded-lg text-white text-sm transition-colors border border-gray-700 hover:border-gray-600">
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-3 text-pink-400" />
                          Expert Consultation
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Program Specific Tools */}
                  <div>
                    <p className="text-gray-300 font-medium mb-3 text-sm">Program Tools:</p>
                    <div className="space-y-2">
                      {program === 'mtech' && (
                        <>
                          <motion.button className="w-full text-left bg-indigo-900/30 hover:bg-indigo-900/50 p-3 rounded-lg text-indigo-300 text-sm transition-colors border border-indigo-500/30">
                            <div className="flex items-center">
                              <Code2 className="h-4 w-4 mr-3" />
                              Code Repository
                            </div>
                          </motion.button>
                          <motion.button className="w-full text-left bg-green-900/30 hover:bg-green-900/50 p-3 rounded-lg text-green-300 text-sm transition-colors border border-green-500/30">
                            <div className="flex items-center">
                              <Database className="h-4 w-4 mr-3" />
                              Simulation Tools
                            </div>
                          </motion.button>
                        </>
                      )}
                      {program === 'mba' && (
                        <>
                          <motion.button className="w-full text-left bg-purple-900/30 hover:bg-purple-900/50 p-3 rounded-lg text-purple-300 text-sm transition-colors border border-purple-500/30">
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-3" />
                              Business Analytics
                            </div>
                          </motion.button>
                          <motion.button className="w-full text-left bg-yellow-900/30 hover:bg-yellow-900/50 p-3 rounded-lg text-yellow-300 text-sm transition-colors border border-yellow-500/30">
                            <div className="flex items-center">
                              <Zap className="h-4 w-4 mr-3" />
                              Strategy Simulator
                            </div>
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Research Tools Section */}
            <div className="md:hidden bg-gray-900 border-t border-gray-700 p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center space-x-3 overflow-x-auto pb-2"
              >
                <motion.button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-400" />
                  Citation
                </motion.button>
                <motion.button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center">
                  <Search className="h-4 w-4 mr-2 text-green-400" />
                  References
                </motion.button>
                <motion.button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center">
                  <Users className="h-4 w-4 mr-2 text-yellow-400" />
                  Groups
                </motion.button>
                {program === 'mtech' && (
                  <motion.button className="bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center border border-indigo-500/30">
                    <Code2 className="h-4 w-4 mr-2" />
                    Code
                  </motion.button>
                )}
                {program === 'mba' && (
                  <motion.button className="bg-purple-900/30 text-purple-300 px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center border border-purple-500/30">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PostGraduateSubjects;