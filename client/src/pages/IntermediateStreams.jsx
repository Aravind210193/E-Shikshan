import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, Star, GraduationCap, FlaskConical, Calculator, Briefcase } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const IntermediateStreams = () => {
  const intermediateData = semesterData.intermediate;

  const streamIcons = {
    science: FlaskConical,
    commerce: Briefcase,
    arts: BookOpen
  };

  const streamColors = {
    science: {
      gradient: 'from-blue-600 to-indigo-600',
      bg: 'bg-blue-900',
      text: 'text-blue-300',
      border: 'border-blue-500'
    },
    commerce: {
      gradient: 'from-green-600 to-emerald-600',
      bg: 'bg-green-900',
      text: 'text-green-300',
      border: 'border-green-500'
    },
    arts: {
      gradient: 'from-purple-600 to-violet-600',
      bg: 'bg-purple-900',
      text: 'text-purple-300',
      border: 'border-purple-500'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
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
                {intermediateData.name}
              </h1>
              <p className="text-blue-100 text-lg">
                Choose Your Academic Stream
              </p>
            </div>
          </div>
          <p className="text-blue-100">
            {intermediateData.description}
          </p>
        </div>
      </div>

      {/* Streams Selection */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Select Your Specialization Stream
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(intermediateData.streams).map(([streamId, streamData]) => {
            const IconComponent = streamIcons[streamId] || BookOpen;
            const colors = streamColors[streamId] || streamColors.science;
            
            // Get sample semester data for display
            const sampleSemester = streamData.semesters['1'];
            
            return (
              <motion.div
                key={streamId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Object.keys(intermediateData.streams).indexOf(streamId) * 0.1 }}
                className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:${colors.border} transition-all duration-300 shadow-lg`}
              >
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{streamData.name}</h3>
                  
                  {/* Stream Statistics */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{sampleSemester.subjects.length} Core Subjects</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-300">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{Object.keys(streamData.semesters).length} Semesters</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-300">
                      <Star className="h-4 w-4 mr-2" />
                      <span>
                        {sampleSemester.subjects.reduce((total, subject) => total + subject.credits, 0)} Credits/Semester
                      </span>
                    </div>
                  </div>

                  {/* Sample Subjects */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Key Subjects:</p>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {sampleSemester.subjects.slice(0, 3).map((subject, idx) => (
                        <div key={idx} className={`${colors.bg} bg-opacity-30 ${colors.text} px-2 py-1 rounded`}>
                          {subject.name}
                        </div>
                      ))}
                      {sampleSemester.subjects.length > 3 && (
                        <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          +{sampleSemester.subjects.length - 3} more subjects
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stream Navigation Button */}
                  <div className="space-y-2">
                    <Link 
                      to={`/content/intermediate/${streamId}`}
                      className={`block bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200`}
                    >
                      Enter {streamData.name}
                    </Link>
                    
                    {/* Quick Access to Semesters */}
                    <div className="text-xs space-y-1">
                      {Object.entries(streamData.semesters).map(([semId, semData]) => (
                        <Link 
                          key={semId}
                          to={`/intermediate/${streamId}/${semId}`}
                          className="block text-gray-400 hover:text-white transition-colors"
                        >
                          → {semData.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stream Comparison */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Stream Comparison & Career Paths
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-blue-400 font-semibold mb-3 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 mr-2" />
                Science Stream
              </h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Engineering & Technology</li>
                <li>• Medical & Healthcare</li>
                <li>• Research & Development</li>
                <li>• Pure Sciences</li>
                <li>• Architecture & Design</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-green-400 font-semibold mb-3 flex items-center justify-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Commerce Stream
              </h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Business Administration</li>
                <li>• Accounting & Finance</li>
                <li>• Economics & Banking</li>
                <li>• Entrepreneurship</li>
                <li>• Chartered Accountancy</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-purple-400 font-semibold mb-3 flex items-center justify-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Arts Stream
              </h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Liberal Arts & Humanities</li>
                <li>• Social Sciences</li>
                <li>• Psychology & Sociology</li>
                <li>• Literature & Languages</li>
                <li>• Fine Arts & Media</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntermediateStreams;