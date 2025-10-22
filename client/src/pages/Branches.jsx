import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Zap, Building, Wrench, ChevronRight } from 'lucide-react';
import branches from '../data/branches.json'; // Assuming you have this data file

const Branches = () => {
  const branchInfo = {
    CSE: {
      Icon: Code,
      theme: { accent: 'bg-sky-600', text: 'text-sky-400', border: 'border-sky-500', hover: 'hover:bg-sky-700', lightBg: 'bg-sky-900/50' },
      description: "Dive into algorithms, data structures, AI, and software development.",
      subjects: ["Data Structures", "Algorithms", "Machine Learning", "Web Development"]
    },
    ECE: {
      Icon: Zap,
      theme: { accent: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500', hover: 'hover:bg-amber-700', lightBg: 'bg-amber-900/50' },
      description: "Explore circuits, communication systems, and embedded electronics.",
      subjects: ["Analog Circuits", "Digital Electronics", "Signal Processing", "VLSI Design"]
    },
    CIVIL: {
      Icon: Building,
      theme: { accent: 'bg-lime-600', text: 'text-lime-400', border: 'border-lime-500', hover: 'hover:bg-lime-700', lightBg: 'bg-lime-900/50' },
      description: "Design and build infrastructure like bridges, roads, and buildings.",
      subjects: ["Structural Analysis", "Geotechnical Engg.", "Transportation", "Fluid Mechanics"]
    },
    MECH: {
      Icon: Wrench,
      theme: { accent: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500', hover: 'hover:bg-rose-700', lightBg: 'bg-rose-900/50' },
      description: "Focus on mechanics, thermodynamics, and manufacturing processes.",
      subjects: ["Thermodynamics", "Fluid Mechanics", "Machine Design", "Robotics"]
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
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-700">
              Undergraduate (B.Tech)
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Select Your Engineering Branch</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="text-center my-8">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Field of Study</h2>
          <p className="text-slate-400">Select a branch to explore its semesters and detailed curriculum.</p>
        </div>
        
        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch, index) => {
            const { Icon, theme, description, subjects } = branchInfo[branch.title];
            
            return (
              <motion.div
                key={branch.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/content/semesters/${branch.title.toLowerCase()}`} className="block h-full">
                  <div className={`bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:${theme.border} transition-all duration-300 flex flex-col h-full group`}>
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${theme.accent}`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{branch.title}</h3>
                          <p className={`${theme.text} font-semibold`}>Engineering</p>
                        </div>
                      </div>
                      
                      <p className="text-slate-400 text-sm mb-6">{description}</p>

                      <p className="text-sm text-slate-300 mb-2 font-semibold">Core Areas:</p>
                      <div className="space-y-2">
                        {subjects.map((subject) => (
                          <div key={subject} className="flex items-center gap-2 text-sm bg-slate-700/50 p-2 rounded-md">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.accent}`}></div>
                            <span className="text-slate-300">{subject}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className={`w-full ${theme.accent} ${theme.hover} text-white px-6 py-3 rounded-lg font-semibold transition-colors flex justify-between items-center`}>
                        <span>Explore {branch.title}</span>
                        <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Branches;
