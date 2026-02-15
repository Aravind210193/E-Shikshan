import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, Star, GraduationCap, FlaskConical, Briefcase, ChevronRight } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const IntermediateStreams = () => {
  const intermediateData = semesterData.intermediate;

  const streamInfo = {
    science: {
      Icon: FlaskConical,
      theme: {
        accent: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500', hover: 'hover:bg-blue-700', lightBg: 'bg-blue-900/50',
      },
      careers: ['Engineering & Technology', 'Medical & Healthcare', 'Research & Development', 'Pure Sciences', 'Architecture']
    },
    commerce: {
      Icon: Briefcase,
      theme: {
        accent: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500', hover: 'hover:bg-emerald-700', lightBg: 'bg-emerald-900/50',
      },
      careers: ['Business Administration', 'Accounting & Finance', 'Economics & Banking', 'Entrepreneurship', 'Chartered Accountancy']
    },
    arts: {
      Icon: BookOpen,
      theme: {
        accent: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500', hover: 'hover:bg-purple-700', lightBg: 'bg-purple-900/50',
      },
      careers: ['Liberal Arts & Humanities', 'Social Sciences', 'Psychology & Sociology', 'Literature & Languages', 'Fine Arts & Media']
    }
  };

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
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-700 flex items-center gap-2">
              <GraduationCap size={16} />
              {intermediateData.name}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">{intermediateData.description}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="text-center my-8">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Academic Path</h2>
          <p className="text-slate-400">Select a stream to explore subjects and career opportunities.</p>
        </div>
        
        {/* Streams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(intermediateData.streams).map(([streamId, streamData], index) => {
            const { Icon, theme } = streamInfo[streamId];
            const sampleSemester = streamData.semesters['1'];
            const totalSemesters = Object.keys(streamData.semesters).length;
            const creditsPerSem = sampleSemester.subjects.reduce((total, subject) => total + subject.credits, 0);

            return (
              <motion.div
                key={streamId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/content/intermediate/${streamId}`} className="block h-full">
                  <div className={`bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:${theme.border} transition-all duration-300 flex flex-col h-full group`}>
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${theme.accent}`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{streamData.name}</h3>
                          <p className={`${theme.text} font-semibold`}>Higher Secondary</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Users size={16} className={theme.text} />
                          <span>{sampleSemester.subjects.length} Subjects</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <BookOpen size={16} className={theme.text} />
                          <span>{totalSemesters} Semesters</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Star size={16} className={theme.text} />
                          <span>{creditsPerSem} Credits/Sem</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 mb-2">Key Subjects:</p>
                      <div className="space-y-2">
                        {sampleSemester.subjects.slice(0, 3).map((subject) => (
                          <div key={subject.code} className="flex items-center gap-2 text-sm bg-slate-700/50 p-2 rounded-md">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.accent}`}></div>
                            <span className="text-slate-300">{subject.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className={`w-full ${theme.accent} ${theme.hover} text-white px-6 py-3 rounded-lg font-semibold transition-colors flex justify-between items-center`}>
                        <span>Explore {streamData.name}</span>
                        <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Career Paths Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-slate-800/50 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Potential Career Paths
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(streamInfo).map(([streamId, info]) => (
              <div key={streamId} className={`${info.theme.lightBg} p-4 rounded-lg`}>
                <h4 className={`${info.theme.text} font-semibold mb-3 flex items-center gap-2`}>
                  <info.Icon size={18} />
                  {intermediateData.streams[streamId].name}
                </h4>
                <ul className="space-y-2">
                  {info.careers.map(career => (
                    <li key={career} className="flex items-start gap-2 text-sm text-slate-300">
                      <ChevronRight size={14} className={`mt-1 flex-shrink-0 ${info.theme.text}`} />
                      <span>{career}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default IntermediateStreams;