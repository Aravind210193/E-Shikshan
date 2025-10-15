import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Users, Star } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const TenthGradeTerms = () => {
  const tenthGradeData = semesterData['10th-grade'];

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
            {tenthGradeData.name}
          </h1>
          <p className="text-green-100 text-lg">
            {tenthGradeData.description}
          </p>
        </div>
      </div>

      {/* Terms Selection */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Select Academic Term
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(tenthGradeData.semesters).map(([termId, termData]) => (
            <motion.div
              key={termId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: parseInt(termId) * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300"
            >
              <Link to={`/10th-grade/${termId}`}>
                <div className="text-center">
                  <div className="bg-green-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{termData.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{termData.subjects.length} Core Subjects</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {termData.subjects.reduce((total, subject) => 
                          total + subject.units.reduce((unitTotal, unit) => unitTotal + unit.hours, 0), 0
                        )} Study Hours
                      </span>
                    </div>
                    <div className="flex items-center justify-center text-gray-300">
                      <Star className="h-4 w-4 mr-2" />
                      <span>
                        {termData.subjects.reduce((total, subject) => total + subject.credits, 0)} Total Credits
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    {termData.subjects.slice(0, 4).map((subject, idx) => (
                      <div key={idx} className="bg-green-900 bg-opacity-30 text-green-300 px-2 py-1 rounded">
                        {subject.name}
                      </div>
                    ))}
                    {termData.subjects.length > 4 && (
                      <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded col-span-2">
                        +{termData.subjects.length - 4} more subjects
                      </div>
                    )}
                  </div>

                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-colors w-full">
                    Start {termData.name}
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Class 10th Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Object.values(tenthGradeData.semesters).reduce((total, term) => total + term.subjects.length, 0)}
              </div>
              <div className="text-gray-400">Total Subjects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Object.values(tenthGradeData.semesters).reduce((total, term) => 
                  total + term.subjects.reduce((termTotal, subject) => termTotal + subject.units.length, 0), 0
                )}
              </div>
              <div className="text-gray-400">Learning Units</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Object.values(tenthGradeData.semesters).reduce((total, term) => 
                  total + term.subjects.reduce((termTotal, subject) => 
                    termTotal + subject.units.reduce((unitTotal, unit) => unitTotal + unit.hours, 0), 0
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

export default TenthGradeTerms;