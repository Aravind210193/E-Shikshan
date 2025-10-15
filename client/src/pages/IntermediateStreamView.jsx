import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Users, Star, GraduationCap } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const IntermediateStreamView = () => {
  const { stream } = useParams();
  const intermediateData = semesterData.intermediate;
  const streamData = intermediateData?.streams?.[stream];

  if (!streamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stream not found</h2>
          <Link to="/content/intermediate" className="text-blue-400 hover:text-blue-300">
            Back to Stream Selection
          </Link>
        </div>
      </div>
    );
  }

  const getStreamColor = (streamName) => {
    switch(streamName) {
      case 'science': return { gradient: 'from-blue-600 to-indigo-600', accent: 'text-blue-400', bg: 'bg-blue-900' };
      case 'commerce': return { gradient: 'from-green-600 to-emerald-600', accent: 'text-green-400', bg: 'bg-green-900' };
      case 'arts': return { gradient: 'from-purple-600 to-violet-600', accent: 'text-purple-400', bg: 'bg-purple-900' };
      default: return { gradient: 'from-blue-600 to-indigo-600', accent: 'text-blue-400', bg: 'bg-blue-900' };
    }
  };

  const colors = getStreamColor(stream);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-8`}>
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/content/intermediate" 
            className="inline-flex items-center text-white hover:text-gray-200 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Stream Selection
          </Link>
          <div className="flex items-center mb-4">
            <GraduationCap className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {streamData.name}
              </h1>
              <p className="text-gray-100 text-lg">
                Intermediate Education - Choose Your Semester
              </p>
            </div>
          </div>
          <p className="text-gray-200">
            Select the semester you want to study from the {streamData.name.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Semesters Selection */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Available Semesters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(streamData.semesters).map(([semId, semData]) => (
            <motion.div
              key={semId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: parseInt(semId) * 0.1 }}
              className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-lg`}
            >
              <Link to={`/intermediate/${stream}/${semId}`}>
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <BookOpen className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{semData.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{semData.subjects.length} Subjects</span>
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
                    {semData.subjects.length > 4 && (
                      <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        +{semData.subjects.length - 4} more subjects
                      </div>
                    )}
                  </div>

                  <button className={`bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white px-6 py-2 rounded-full font-medium transition-all w-full`}>
                    Start {semData.name}
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stream Overview */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            {streamData.name} Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${colors.accent} mb-1`}>
                {Object.values(streamData.semesters).reduce((total, sem) => total + sem.subjects.length, 0)}
              </div>
              <div className="text-gray-400">Total Subjects</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${colors.accent} mb-1`}>
                {Object.values(streamData.semesters).reduce((total, sem) => 
                  total + sem.subjects.reduce((semTotal, subject) => semTotal + subject.units.length, 0), 0
                )}
              </div>
              <div className="text-gray-400">Learning Units</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${colors.accent} mb-1`}>
                {Object.values(streamData.semesters).reduce((total, sem) => 
                  total + sem.subjects.reduce((semTotal, subject) => 
                    semTotal + subject.units.reduce((unitTotal, unit) => unitTotal + unit.hours, 0), 0
                  ), 0
                )}
              </div>
              <div className="text-gray-400">Study Hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntermediateStreamView;