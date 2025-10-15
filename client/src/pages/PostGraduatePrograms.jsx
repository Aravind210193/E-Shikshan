import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, Star, Award, GraduationCap, Briefcase, Code, FlaskConical, Clock } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const PostGraduatePrograms = () => {
  const pgData = semesterData.postgraduate;

  const programIcons = {
    mba: Briefcase,
    mtech: Code,
    msc: FlaskConical
  };

  const programColors = {
    mba: {
      gradient: 'from-red-600 to-pink-600',
      bg: 'bg-red-900',
      text: 'text-red-300',
      border: 'border-red-500'
    },
    mtech: {
      gradient: 'from-indigo-600 to-purple-600',
      bg: 'bg-indigo-900',
      text: 'text-indigo-300',
      border: 'border-indigo-500'
    },
    msc: {
      gradient: 'from-green-600 to-teal-600',
      bg: 'bg-green-900',
      text: 'text-green-300',
      border: 'border-green-500'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-8">
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
                {pgData.name}
              </h1>
              <p className="text-gray-100 text-lg">
                Advanced Specialization Programs
              </p>
            </div>
          </div>
          <p className="text-gray-200">
            {pgData.description}
          </p>
        </div>
      </div>

      {/* Programs Selection */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Choose Your Master's Program
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Object.entries(pgData.programs).map(([programId, programData]) => {
            const IconComponent = programIcons[programId] || GraduationCap;
            const colors = programColors[programId] || programColors.mba;
            
            return (
              <motion.div
                key={programId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Object.keys(pgData.programs).indexOf(programId) * 0.1 }}
                className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:${colors.border} transition-all duration-300 shadow-xl`}
              >
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{programData.name}</h3>
                  
                  {/* Program Type Specific Content */}
                  {programId === 'mba' && (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-center text-gray-300">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{programData.semesters['1'].subjects.length} Core Subjects</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-300">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{pgData.totalSemesters} Semesters</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-300">
                          <Star className="h-4 w-4 mr-2" />
                          <span>
                            {programData.semesters['1'].subjects.reduce((total, subject) => total + subject.credits, 0)} Credits/Semester
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">Core Subjects:</p>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          {programData.semesters['1'].subjects.slice(0, 4).map((subject, idx) => (
                            <div key={idx} className={`${colors.bg} bg-opacity-30 ${colors.text} px-2 py-1 rounded`}>
                              {subject.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Link 
                          to={`/content/postgraduate/${programId}`}
                          className={`block bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200`}
                        >
                          Enter {programData.name}
                        </Link>
                        
                        {/* Quick Access to Semesters */}
                        <div className="text-xs space-y-1">
                          {Object.entries(programData.semesters).map(([semId, semData]) => (
                            <Link 
                              key={semId}
                              to={`/postgraduate/mba//${semId}`}
                              className="block text-gray-400 hover:text-white transition-colors"
                            >
                              → {semData.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {programId !== 'mba' && programData.specializations && (
                    <>
                      <div className="mb-4">
                        <Link 
                          to={`/content/postgraduate/${programId}`}
                          className={`block bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 mb-3`}
                        >
                          Enter {programData.name}
                        </Link>
                        
                        <p className="text-gray-400 text-sm mb-2">Available Specializations:</p>
                        <div className="space-y-1 text-xs">
                          {Object.entries(programData.specializations).map(([specId, specData]) => (
                            <div key={specId} className="text-gray-400">
                              → {specData.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Program Comparison */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Program Overview & Career Outcomes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-red-400 font-semibold mb-3 flex items-center justify-center">
                <Briefcase className="h-5 w-5 mr-2" />
                MBA Program
              </h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Executive Leadership Roles</li>
                <li>• Business Strategy & Consulting</li>
                <li>• Financial Management</li>
                <li>• Entrepreneurship & Startups</li>
                <li>• Corporate Management</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-indigo-400 font-semibold mb-3 flex items-center justify-center">
                <Code className="h-5 w-5 mr-2" />
                M.Tech Programs
              </h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Advanced Technical Roles</li>
                <li>• Research & Development</li>
                <li>• Product Innovation</li>
                <li>• Technical Leadership</li>
                <li>• Academic & Industry Research</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-green-400 font-semibold mb-3 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 mr-2" />
                M.Sc Programs
              </h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Scientific Research</li>
                <li>• Laboratory Management</li>
                <li>• Academic Positions</li>
                <li>• Specialized Consulting</li>
                <li>• Ph.D. Preparation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostGraduatePrograms;