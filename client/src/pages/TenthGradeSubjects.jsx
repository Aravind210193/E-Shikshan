import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Target, CheckCircle, FileText, Download, Eye, PlayCircle } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const TenthGradeSubjects = () => {
  const { semester } = useParams();
  const [completedUnits, setCompletedUnits] = useState(new Set());
  const [expandedUnits, setExpandedUnits] = useState(new Set());
  const [selectedPdf, setSelectedPdf] = useState(null);

  const tenthGradeData = semesterData['10th-grade'];
  const currentSemester = tenthGradeData?.semesters?.[semester];

  if (!currentSemester) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Term not found</h2>
          <Link to="/content" className="text-green-400 hover:text-green-300">
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

  const generatePdfResources = (subject, unit, unitIndex) => {
    // Generate sample PDF resources for 10th grade subjects
    const baseResources = [
      { 
        name: `${unit.title} - Notes`, 
        type: 'notes', 
        size: '2.5 MB',
        pages: Math.floor(Math.random() * 20) + 10
      },
      { 
        name: `${unit.title} - Examples`, 
        type: 'examples', 
        size: '1.8 MB',
        pages: Math.floor(Math.random() * 15) + 8
      },
      { 
        name: `${unit.title} - Practice Questions`, 
        type: 'practice', 
        size: '1.2 MB',
        pages: Math.floor(Math.random() * 12) + 6
      }
    ];
    
    return baseResources.slice(0, 2 + Math.floor(Math.random() * 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/content" 
            className="inline-flex items-center text-white hover:text-green-200 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Education Levels
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            {currentSemester.name} - Class 10th
          </h1>
          <p className="text-green-100 text-lg">
            Core subjects for secondary education completion
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentSemester.subjects.map((subject, index) => (
            <motion.div
              key={subject.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300"
            >
              {/* Subject Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                  <p className="text-gray-400 text-sm">{subject.code}</p>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
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
                <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Units & Topics
                </h4>
                {subject.units.map((unit, unitIndex) => {
                  const unitKey = `${subject.code}-${unitIndex}`;
                  const isCompleted = completedUnits.has(unitKey);
                  const isExpanded = expandedUnits.has(unitKey);
                  const pdfResources = generatePdfResources(subject, unit, unitIndex);
                  
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
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => toggleUnitComplete(subject.code, unitIndex)}
                                  className={`${isCompleted ? 'text-green-400' : 'text-gray-500'} hover:text-green-300 transition-colors`}
                                >
                                  <CheckCircle className={`h-5 w-5 ${isCompleted ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-400 text-xs mb-3">
                          <Clock className="h-3 w-3 mr-1" />
                          {unit.hours} hours
                          <span className="mx-2">•</span>
                          <FileText className="h-3 w-3 mr-1" />
                          {pdfResources.length} resources
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {unit.topics.slice(0, 3).map((topic, idx) => (
                            <span key={idx} className="bg-green-900 bg-opacity-30 text-green-300 text-xs px-2 py-1 rounded">
                              {topic}
                            </span>
                          ))}
                          {unit.topics.length > 3 && (
                            <span className="text-gray-400 text-xs px-2 py-1">
                              +{unit.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expandable PDF Resources Section */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-700 bg-gray-800"
                        >
                          <div className="p-4">
                            <h6 className="text-green-400 font-medium text-sm mb-3 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Study Materials & Resources
                            </h6>
                            
                            <div className="space-y-2">
                              {pdfResources.map((resource, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-600">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-green-600 p-2 rounded-lg">
                                      <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-white text-sm font-medium">{resource.name}</p>
                                      <p className="text-gray-400 text-xs">
                                        {resource.size} • {resource.pages} pages
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setSelectedPdf(resource)}
                                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
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

                            {/* Additional Learning Resources */}
                            <div className="mt-4 pt-3 border-t border-gray-700">
                              <p className="text-gray-400 text-xs mb-2">Additional Resources:</p>
                              <div className="flex flex-wrap gap-2">
                                <button className="bg-blue-600 bg-opacity-20 text-blue-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors flex items-center">
                                  <PlayCircle className="h-3 w-3 mr-1" />
                                  Video Lessons
                                </button>
                                <button className="bg-purple-600 bg-opacity-20 text-purple-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                                  Interactive Quiz
                                </button>
                                <button className="bg-yellow-600 bg-opacity-20 text-yellow-300 text-xs px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                                  Past Papers
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
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(subject.units.filter((_, idx) => completedUnits.has(`${subject.code}-${idx}`)).length / subject.units.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">{selectedPdf.name}</h3>
              <button
                onClick={() => setSelectedPdf(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-gray-700 h-96 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-white mb-2">PDF Viewer</p>
                <p className="text-gray-400 text-sm mb-4">{selectedPdf.name}</p>
                <p className="text-gray-400 text-xs">
                  {selectedPdf.size} • {selectedPdf.pages} pages
                </p>
                <div className="mt-4 space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Open in New Tab
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenthGradeSubjects;