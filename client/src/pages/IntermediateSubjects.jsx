import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Target, CheckCircle, GraduationCap, Users, FileText, Download, Eye, PlayCircle, Lightbulb, Calculator, FlaskConical } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const IntermediateSubjects = () => {
  const { stream, semester } = useParams();
  const [completedUnits, setCompletedUnits] = useState(new Set());
  const [expandedUnits, setExpandedUnits] = useState(new Set());
  const [selectedPdf, setSelectedPdf] = useState(null);

  const intermediateData = semesterData.intermediate;
  const currentStream = intermediateData?.streams?.[stream];
  const currentSemester = currentStream?.semesters?.[semester];

  if (!currentSemester) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stream or Semester not found</h2>
          <Link to="/content" className="text-blue-400 hover:text-blue-300">
            Back to Courses
          </Link>
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

  const generateIntermediatePdfResources = (subject, unit, unitIndex, stream) => {
    // Generate intermediate-level PDF resources based on stream and subject
    const baseResources = [
      { 
        name: `${unit.title} - Theory & Concepts`, 
        type: 'theory', 
        size: `${(Math.random() * 3 + 2).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 25) + 15,
        difficulty: 'Intermediate'
      },
      { 
        name: `${unit.title} - Solved Examples`, 
        type: 'examples', 
        size: `${(Math.random() * 2 + 1.5).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 20) + 12,
        difficulty: 'Intermediate'
      },
      { 
        name: `${unit.title} - Problem Bank`, 
        type: 'problems', 
        size: `${(Math.random() * 2.5 + 1).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 18) + 10,
        difficulty: 'Advanced'
      }
    ];

    // Add stream-specific resources
    if (stream === 'science') {
      baseResources.push({
        name: `${unit.title} - Lab Manual`,
        type: 'lab',
        size: `${(Math.random() * 1.5 + 1).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 12) + 8,
        difficulty: 'Practical'
      });
    } else if (stream === 'commerce') {
      baseResources.push({
        name: `${unit.title} - Case Studies`,
        type: 'cases',
        size: `${(Math.random() * 2 + 1.2).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 15) + 8,
        difficulty: 'Applied'
      });
    }
    
    return baseResources.slice(0, 3 + Math.floor(Math.random() * 2));
  };

  const getStreamColor = (streamName) => {
    switch(streamName) {
      case 'science': return 'from-blue-600 to-indigo-600';
      case 'commerce': return 'from-green-600 to-emerald-600';
      case 'arts': return 'from-purple-600 to-violet-600';
      default: return 'from-blue-600 to-indigo-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getStreamColor(stream)} px-6 py-8`}>
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/content" 
            className="inline-flex items-center text-white hover:text-blue-200 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Education Levels
          </Link>
          <div className="flex items-center mb-4">
            <GraduationCap className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {currentSemester.name}
              </h1>
              <p className="text-blue-100 text-lg capitalize">
                {currentStream.name} Stream
              </p>
            </div>
          </div>
          <p className="text-blue-100">
            Intermediate education preparing students for higher studies and competitive exams
          </p>
        </div>
      </div>

      {/* Stream Selector */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-4">
            <Link 
              to={`/intermediate/science/${semester}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                stream === 'science' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Science Stream
            </Link>
            <Link 
              to={`/intermediate/commerce/${semester}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                stream === 'commerce' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Commerce Stream
            </Link>
            <Link 
              to={`/intermediate/arts/${semester}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                stream === 'arts' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Arts Stream
            </Link>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {currentSemester.subjects.map((subject, index) => (
            <motion.div
              key={subject.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-lg"
            >
              {/* Subject Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                  <p className="text-gray-400 text-sm">{subject.code}</p>
                </div>
                <div className="flex items-center space-x-2 text-blue-400">
                  <BookOpen className="h-5 w-5" />
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
              </div>

              {/* Units */}
              <div className="space-y-3">
                <h4 className="text-blue-400 font-semibold mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Units & Topics ({subject.units.length} units)
                </h4>
                {subject.units.map((unit, unitIndex) => {
                  const unitKey = `${subject.code}-${unitIndex}`;
                  const isCompleted = completedUnits.has(unitKey);
                  const isExpanded = expandedUnits.has(unitKey);
                  const pdfResources = generateIntermediatePdfResources(subject, unit, unitIndex, stream);
                  
                  return (
                    <div key={unitIndex} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                      {/* Unit Header */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-white font-medium text-sm">{unit.title}</h5>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleUnitExpand(subject.code, unitIndex)}
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => toggleUnitComplete(subject.code, unitIndex)}
                                  className={`${isCompleted ? 'text-blue-400' : 'text-gray-500'} hover:text-blue-300 transition-colors`}
                                >
                                  <CheckCircle className={`h-5 w-5 ${isCompleted ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-400 text-xs mb-3">
                          <Clock className="h-3 w-3 mr-1" />
                          {unit.hours} hours intensive study
                          <span className="mx-2">•</span>
                          <FileText className="h-3 w-3 mr-1" />
                          {pdfResources.length} advanced resources
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {unit.topics.slice(0, 4).map((topic, idx) => (
                            <span key={idx} className="bg-blue-900 bg-opacity-30 text-blue-300 text-xs px-2 py-1 rounded">
                              {topic}
                            </span>
                          ))}
                          {unit.topics.length > 4 && (
                            <span className="text-gray-400 text-xs px-2 py-1">
                              +{unit.topics.length - 4} more advanced topics
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expandable Resources Section - Enhanced for Intermediate */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-700 bg-gray-800"
                        >
                          <div className="p-4">
                            <h6 className="text-blue-400 font-medium text-sm mb-3 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Advanced Study Materials & Resources
                            </h6>
                            
                            <div className="space-y-3">
                              {pdfResources.map((resource, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-600">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${
                                      resource.difficulty === 'Advanced' ? 'bg-red-600' :
                                      resource.difficulty === 'Practical' ? 'bg-green-600' :
                                      resource.difficulty === 'Applied' ? 'bg-purple-600' :
                                      'bg-blue-600'
                                    }`}>
                                      {resource.type === 'lab' ? <FlaskConical className="h-4 w-4 text-white" /> :
                                       resource.type === 'problems' ? <Calculator className="h-4 w-4 text-white" /> :
                                       resource.type === 'cases' ? <Lightbulb className="h-4 w-4 text-white" /> :
                                       <FileText className="h-4 w-4 text-white" />}
                                    </div>
                                    <div>
                                      <p className="text-white text-sm font-medium">{resource.name}</p>
                                      <p className="text-gray-400 text-xs">
                                        {resource.size} • {resource.pages} pages • {resource.difficulty}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setSelectedPdf(resource)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                                      title="View PDF"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                                      title="Download PDF"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Stream-Specific Learning Tools */}
                            <div className="mt-4 pt-3 border-t border-gray-700">
                              <p className="text-gray-400 text-xs mb-2">Stream-Specific Tools:</p>
                              <div className="flex flex-wrap gap-2">
                                {stream === 'science' && (
                                  <>
                                    <button className="bg-green-600 bg-opacity-20 text-green-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors flex items-center">
                                      <FlaskConical className="h-3 w-3 mr-1" />
                                      Virtual Lab
                                    </button>
                                    <button className="bg-blue-600 bg-opacity-20 text-blue-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors flex items-center">
                                      <Calculator className="h-3 w-3 mr-1" />
                                      Formula Sheet
                                    </button>
                                  </>
                                )}
                                {stream === 'commerce' && (
                                  <>
                                    <button className="bg-purple-600 bg-opacity-20 text-purple-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                                      Case Studies
                                    </button>
                                    <button className="bg-yellow-600 bg-opacity-20 text-yellow-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                                      Business Simulator
                                    </button>
                                  </>
                                )}
                                <button className="bg-red-600 bg-opacity-20 text-red-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors flex items-center">
                                  <PlayCircle className="h-3 w-3 mr-1" />
                                  Video Lectures
                                </button>
                                <button className="bg-indigo-600 bg-opacity-20 text-indigo-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                                  JEE/NEET Prep
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>
                    {subject.units.filter((_, idx) => completedUnits.has(`${subject.code}-${idx}`)).length} / {subject.units.length} units
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(subject.units.filter((_, idx) => completedUnits.has(`${subject.code}-${idx}`)).length / subject.units.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Total Study Hours */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-center">
                  <span className="text-gray-400 text-sm">Total Study Hours: </span>
                  <span className="text-white font-semibold">
                    {subject.units.reduce((total, unit) => total + unit.hours, 0)} hours
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stream Info */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-400" />
            About {currentStream.name} Stream
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {currentSemester.subjects.length}
              </div>
              <div className="text-gray-400">Core Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {currentSemester.subjects.reduce((total, subject) => total + subject.units.length, 0)}
              </div>
              <div className="text-gray-400">Total Units</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {currentSemester.subjects.reduce((total, subject) => total + subject.units.reduce((unitTotal, unit) => unitTotal + unit.hours, 0), 0)}
              </div>
              <div className="text-gray-400">Study Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced PDF Viewer Modal for Intermediate */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div>
                <h3 className="text-white font-semibold">{selectedPdf.name}</h3>
                <p className="text-gray-400 text-sm">{selectedPdf.difficulty} Level • {stream.charAt(0).toUpperCase() + stream.slice(1)} Stream</p>
              </div>
              <button
                onClick={() => setSelectedPdf(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 bg-gray-700 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className={`p-4 rounded-full w-20 h-20 mx-auto mb-4 ${
                  selectedPdf.difficulty === 'Advanced' ? 'bg-red-600' :
                  selectedPdf.difficulty === 'Practical' ? 'bg-green-600' :
                  selectedPdf.difficulty === 'Applied' ? 'bg-purple-600' :
                  'bg-blue-600'
                }`}>
                  {selectedPdf.type === 'lab' ? <FlaskConical className="h-8 w-8 text-white mx-auto mt-2" /> :
                   selectedPdf.type === 'problems' ? <Calculator className="h-8 w-8 text-white mx-auto mt-2" /> :
                   selectedPdf.type === 'cases' ? <Lightbulb className="h-8 w-8 text-white mx-auto mt-2" /> :
                   <FileText className="h-8 w-8 text-white mx-auto mt-2" />}
                </div>
                <p className="text-white mb-2 text-lg font-semibold">Intermediate Level PDF Viewer</p>
                <p className="text-gray-300 text-sm mb-2">{selectedPdf.name}</p>
                <p className="text-gray-400 text-xs mb-6">
                  {selectedPdf.size} • {selectedPdf.pages} pages • {selectedPdf.difficulty} difficulty
                </p>
                <div className="space-y-3">
                  <div className="flex justify-center space-x-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </button>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button className="bg-green-600 bg-opacity-20 text-green-300 text-xs px-3 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                      Add to Study Plan
                    </button>
                    <button className="bg-yellow-600 bg-opacity-20 text-yellow-300 text-xs px-3 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                      Mark as Important
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntermediateSubjects;