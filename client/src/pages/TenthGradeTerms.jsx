import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Users, Star, ChevronRight } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const TenthGradeTerms = () => {
  const tenthGradeData = semesterData['10th-grade'];
  const theme = {
    accent: 'bg-emerald-600',
    text: 'text-emerald-400',
    border: 'border-emerald-500',
    hover: 'hover:bg-emerald-700',
    lightBg: 'bg-emerald-900/50',
  };

  const totalSubjects = Object.values(tenthGradeData.semesters).reduce((total, term) => total + term.subjects.length, 0);
  const totalUnits = Object.values(tenthGradeData.semesters).reduce((total, term) => 
    total + term.subjects.reduce((termTotal, subject) => termTotal + subject.units.length, 0), 0
  );
  const totalHours = Object.values(tenthGradeData.semesters).reduce((total, term) => 
    total + term.subjects.reduce((termTotal, subject) => 
      termTotal + subject.units.reduce((unitTotal, unit) => unitTotal + unit.hours, 0), 0
    ), 0
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link to="/content" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Education Levels</span>
            </Link>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${theme.accent}`}>
              {tenthGradeData.name}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">{tenthGradeData.description}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="text-center my-8">
          <h2 className="text-2xl font-bold text-white mb-2">Select an Academic Term</h2>
          <p className="text-slate-400">Choose a term to view its subjects and curriculum.</p>
        </div>
        
        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(tenthGradeData.semesters).map(([termId, termData], index) => {
            const termHours = termData.subjects.reduce((total, subject) => 
              total + subject.units.reduce((unitTotal, unit) => unitTotal + unit.hours, 0), 0
            );
            const termCredits = termData.subjects.reduce((total, subject) => total + subject.credits, 0);

            return (
              <motion.div
                key={termId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/10th-grade/${termId}`} className="block h-full">
                  <div className={`bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:${theme.border} transition-all duration-300 flex flex-col h-full group`}>
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${theme.accent}`}>
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{termData.name}</h3>
                          <p className={`${theme.text} font-semibold`}>Foundation Year</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Users size={16} className={theme.text} />
                          <span>{termData.subjects.length} Subjects</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock size={16} className={theme.text} />
                          <span>{termHours} Study Hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Star size={16} className={theme.text} />
                          <span>{termCredits} Credits</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {termData.subjects.slice(0, 3).map((subject) => (
                          <div key={subject.code} className="flex items-center gap-2 text-sm bg-slate-700/50 p-2 rounded-md">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.accent}`}></div>
                            <span className="text-slate-300">{subject.name}</span>
                          </div>
                        ))}
                        {termData.subjects.length > 3 && (
                           <div className="flex items-center gap-2 text-sm p-2">
                             <span className="text-slate-500">+{termData.subjects.length - 3} more...</span>
                           </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className={`w-full ${theme.accent} ${theme.hover} text-white px-6 py-3 rounded-lg font-semibold transition-colors flex justify-between items-center`}>
                        <span>View {termData.name}</span>
                        <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Overview Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-slate-800/50 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Full Year Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className={`${theme.lightBg} p-4 rounded-lg`}>
              <div className={`text-3xl font-bold ${theme.text} mb-1`}>{totalSubjects}</div>
              <div className="text-slate-400">Total Subjects</div>
            </div>
            <div className={`${theme.lightBg} p-4 rounded-lg`}>
              <div className={`text-3xl font-bold ${theme.text} mb-1`}>{totalUnits}</div>
              <div className="text-slate-400">Learning Units</div>
            </div>
            <div className={`${theme.lightBg} p-4 rounded-lg`}>
              <div className={`text-3xl font-bold ${theme.text} mb-1`}>{totalHours}</div>
              <div className="text-slate-400">Total Study Hours</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TenthGradeTerms;