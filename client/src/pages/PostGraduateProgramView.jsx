import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Users, Star, Award, Briefcase, Code, FlaskConical } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const PostGraduateProgramView = () => {
  const { program } = useParams();
  const pgData = semesterData.postgraduate;
  const programData = pgData?.programs?.[program];

  if (!programData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Program not found</h2>
          <Link to="/content/postgraduate" className="text-red-400 hover:text-red-300">
            Back to Program Selection
          </Link>
        </div>
      </div>
    );
  }

  const getProgramColor = (programName) => {
    switch(programName) {
      case 'mba': return { gradient: 'from-red-600 to-pink-600', accent: 'text-red-400', bg: 'bg-red-900' };
      case 'mtech': return { gradient: 'from-indigo-600 to-purple-600', accent: 'text-indigo-400', bg: 'bg-indigo-900' };
      case 'msc': return { gradient: 'from-green-600 to-teal-600', accent: 'text-green-400', bg: 'bg-green-900' };
      default: return { gradient: 'from-red-600 to-pink-600', accent: 'text-red-400', bg: 'bg-red-900' };
    }
  };

  const getProgramIcon = (programName) => {
    switch(programName) {
      case 'mba': return Briefcase;
      case 'mtech': return Code;
      case 'msc': return FlaskConical;
      default: return Award;
    }
  };

  const colors = getProgramColor(program);
  const IconComponent = getProgramIcon(program);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-8`}>
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/content/postgraduate" 
            className="inline-flex items-center text-white hover:text-gray-200 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Program Selection
          </Link>
          <div className="flex items-center mb-4">
            <IconComponent className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {programData.name}
              </h1>
              <p className="text-gray-100 text-lg">
                {program === 'mba' ? 'Choose Your Semester' : 'Choose Your Specialization'}
              </p>
            </div>
          </div>
          <p className="text-gray-200">
            Advanced postgraduate curriculum designed for professional excellence
          </p>
        </div>
      </div>

      {/* Content Selection */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {program === 'mba' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              MBA Semesters
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {Object.entries(programData.semesters).map(([semId, semData]) => (
                <motion.div
                  key={semId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: parseInt(semId) * 0.1 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-all duration-300 shadow-lg"
                >
                  <Link to={`/postgraduate/mba//${semId}`}>
                    <div className="text-center">
                      <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                        <BookOpen className="h-8 w-8" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3">{semData.name}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-center text-gray-300">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{semData.subjects.length} Core Subjects</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-300">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {semData.subjects.reduce((total, subject) => 
                              total + subject.units.reduce((unitTotal, unit) => unitTotal + unit.hours, 0), 0
                            )} Study Hours
                          </span>
                        </div>
                        <div className="flex items-center justify-center text-gray-300">
                          <Star className="h-4 w-4 mr-2" />
                          <span>
                            {semData.subjects.reduce((total, subject) => total + subject.credits, 0)} Credits
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-xs mb-4">
                        {semData.subjects.slice(0, 4).map((subject, idx) => (
                          <div key={idx} className={`${colors.bg} bg-opacity-30 ${colors.accent} px-2 py-1 rounded`}>
                            {subject.name}
                          </div>
                        ))}
                      </div>

                      <button className={`bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white px-6 py-2 rounded-full font-medium transition-all w-full`}>
                        Start {semData.name}
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {program !== 'mba' && programData.specializations && (
          <>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Available Specializations
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(programData.specializations).map(([specId, specData]) => (
                <motion.div
                  key={specId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Object.keys(programData.specializations).indexOf(specId) * 0.1 }}
                  className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 shadow-lg`}
                >
                  <div className="text-center">
                    <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{specData.name}</h3>
                    
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Available Semesters:</p>
                      <div className="space-y-2">
                        {Object.entries(specData.semesters).map(([semId, semData]) => (
                          <Link 
                            key={semId}
                            to={`/postgraduate/${program}/${specId}/${semId}`}
                            className={`block bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200`}
                          >
                            {semData.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Program Overview */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            {programData.name} Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${colors.accent} mb-1`}>
                {program === 'mba' 
                  ? Object.values(programData.semesters).reduce((total, sem) => total + sem.subjects.length, 0)
                  : Object.values(programData.specializations).reduce((total, spec) => 
                      total + Object.values(spec.semesters).reduce((specTotal, sem) => specTotal + sem.subjects.length, 0), 0
                    )
                }
              </div>
              <div className="text-gray-400">Total Courses</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${colors.accent} mb-1`}>
                {program === 'mba' ? 2 : Object.keys(programData.specializations || {}).length}
              </div>
              <div className="text-gray-400">{program === 'mba' ? 'Semesters' : 'Specializations'}</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${colors.accent} mb-1`}>
                {program === 'mba'
                  ? Object.values(programData.semesters).reduce((total, sem) => 
                      total + sem.subjects.reduce((semTotal, subject) => semTotal + subject.credits, 0), 0
                    )
                  : 'Advanced'
                }
              </div>
              <div className="text-gray-400">{program === 'mba' ? 'Total Credits' : 'Curriculum'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostGraduateProgramView;