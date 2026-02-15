import React, { useState, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, ChevronDown, Clock, FileText, Download, X, Award, Brain, Target, Star, BookMarked } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const PostGraduateSubjects = () => {
  const { program, specialization, semester } = useParams();
  const navigate = useNavigate();
  
  const [completedUnits, setCompletedUnits] = useState(() => {
    try {
      const saved = localStorage.getItem(`completedUnits_${program}_${specialization}_${semester}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      return new Set();
    }
  });

  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedUnits, setExpandedUnits] = useState(new Set());

  const subjectRefs = useRef({});

  const { currentProgram, currentSemester } = useMemo(() => {
    const pgData = semesterData.postgraduate;
    const prog = pgData?.programs?.[program];
    let sem;
    if (program === 'mba') {
      sem = prog?.semesters?.[semester];
    } else if (prog?.specializations) {
      sem = prog.specializations?.[specialization]?.semesters?.[semester];
    }
    return { currentProgram: prog, currentSemester: sem };
  }, [program, specialization, semester]);

  if (!currentSemester) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <Target size={48} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Content Not Found</h1>
        <p className="text-slate-400 mb-6 text-center">The program, specialization, or semester you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/content/postgraduate')}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Programs
        </button>
      </div>
    );
  }

  const getProgramTitle = () => {
    if (program === 'mba') return currentProgram.name;
    if (specialization) {
      return `${currentProgram.name}: ${currentProgram.specializations[specialization].name}`;
    }
    return currentProgram.name;
  };

  const totalUnits = currentSemester.subjects.reduce((acc, subject) => acc + subject.units.length, 0);
  const totalCompleted = currentSemester.subjects.reduce((acc, subject) => {
    return acc + subject.units.filter((_, unitIndex) => completedUnits.has(`${subject.code}-${unitIndex}`)).length;
  }, 0);
  const overallCompletion = totalUnits > 0 ? (totalCompleted / totalUnits) * 100 : 0;

  const handleToggleUnit = (subjectCode, unitIndex) => {
    const unitId = `${subjectCode}-${unitIndex}`;
    const newCompleted = new Set(completedUnits);
    if (newCompleted.has(unitId)) {
      newCompleted.delete(unitId);
    } else {
      newCompleted.add(unitId);
    }
    setCompletedUnits(newCompleted);
    localStorage.setItem(`completedUnits_${program}_${specialization}_${semester}`, JSON.stringify(Array.from(newCompleted)));
  };

  const handleToggleExpand = (subjectCode, unitIndex) => {
    const unitId = `${subjectCode}-${unitIndex}`;
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const scrollToSubject = (subjectCode) => {
    setActiveSubject(subjectCode);
    subjectRefs.current[subjectCode]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const programTheme = {
    'mba': { accent: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500', hover: 'hover:bg-rose-700' },
    'mtech': { accent: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-500', hover: 'hover:bg-indigo-700' },
    'msc': { accent: 'bg-teal-600', text: 'text-teal-400', border: 'border-teal-500', hover: 'hover:bg-teal-700' },
  }[program] || { accent: 'bg-slate-600', text: 'text-slate-400', border: 'border-slate-500', hover: 'hover:bg-slate-700' };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 p-4">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link to={`/content/postgraduate/${program}${specialization ? `/${specialization}` : ''}`} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Semesters</span>
            </Link>
            <div className="flex items-center gap-4">
                <span className={`hidden md:inline px-3 py-1 text-sm font-semibold rounded-full ${programTheme.accent}`}>{getProgramTitle()}</span>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-700">{currentSemester.name}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
             <h1 className="text-2xl sm:text-3xl font-bold text-white">{currentSemester.name} Curriculum</h1>
             <div className="w-full sm:w-auto">
                <p className="text-sm text-slate-400 mb-1 text-right">{totalCompleted} / {totalUnits} Units Completed</p>
                <div className="w-full h-2 bg-slate-700 rounded-full">
                    <motion.div 
                        className={`h-2 rounded-full ${programTheme.accent}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${overallCompletion}%`}}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Subject Navigation */}
        <aside className="lg:col-span-3 lg:sticky lg:top-28 h-max">
          <h2 className="text-lg font-semibold mb-4 text-slate-300">Subjects</h2>
          <nav className="space-y-2">
            {currentSemester.subjects.map(subject => (
              <button
                key={subject.code}
                onClick={() => scrollToSubject(subject.code)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 border-l-4 ${
                  activeSubject === subject.code
                    ? `${programTheme.border} bg-slate-800 text-white`
                    : 'border-transparent text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <p className="font-semibold">{subject.name}</p>
                <p className="text-xs text-slate-500">{subject.code}</p>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content: Subject Details */}
        <main className="lg:col-span-9">
          <div className="space-y-12">
            {currentSemester.subjects.map((subject, subjectIdx) => {
              const subjectCompletedUnits = subject.units.filter((_, unitIndex) => completedUnits.has(`${subject.code}-${unitIndex}`)).length;
              const subjectCompletion = subject.units.length > 0 ? (subjectCompletedUnits / subject.units.length) * 100 : 0;

              return (
                <motion.section
                  key={subject.code}
                  ref={el => subjectRefs.current[subject.code] = el}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: subjectIdx * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
                >
                  <div className="border-b border-slate-700 pb-4 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className={`text-2xl font-bold ${programTheme.text}`}>{subject.name}</h3>
                            <p className="text-slate-400">{subject.code}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Star size={16} className={programTheme.text} />
                                <span className="font-semibold">{subject.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookMarked size={16} className={programTheme.text} />
                                <span className="font-semibold">{subject.credits} Credits</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center text-sm text-slate-400 mb-1">
                            <span>Progress</span>
                            <span>{subjectCompletedUnits} / {subject.units.length}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full">
                            <motion.div 
                                className={`h-1.5 rounded-full ${programTheme.accent}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${subjectCompletion}%`}}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {subject.units.map((unit, unitIndex) => {
                      const unitId = `${subject.code}-${unitIndex}`;
                      const isCompleted = completedUnits.has(unitId);
                      const isExpanded = expandedUnits.has(unitId);

                      return (
                        <div key={unitIndex} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                          <button
                            onClick={() => handleToggleExpand(subject.code, unitIndex)}
                            className="w-full flex justify-between items-center p-4 text-left"
                          >
                            <div className="flex items-center gap-4">
                              <button onClick={(e) => { e.stopPropagation(); handleToggleUnit(subject.code, unitIndex); }}>
                                <CheckCircle size={20} className={`transition-colors ${isCompleted ? programTheme.text : 'text-slate-600 hover:text-slate-400'}`} />
                              </button>
                              <span className={`font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>{unit.title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {unit.hours} hrs</span>
                              <ChevronDown size={20} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 border-t border-slate-700">
                                  <h5 className="font-semibold text-slate-300 mb-3">Key Topics:</h5>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {unit.topics.map(topic => (
                                      <span key={topic} className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">{topic}</span>
                                    ))}
                                  </div>
                                  <h5 className="font-semibold text-slate-300 mb-3">Resources:</h5>
                                  <div className="space-y-2">
                                    {/* Simplified resource generation */}
                                    {[...Array(3)].map((_, i) => (
                                      <div key={i} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-md">
                                        <div className="flex items-center gap-3">
                                          <FileText size={16} className={programTheme.text} />
                                          <span className="text-sm text-slate-300">{unit.title} - Resource {i + 1}</span>
                                        </div>
                                        <a href="#" className={`p-1.5 rounded-md ${programTheme.accent} ${programTheme.hover} transition-colors`}>
                                          <Download size={16} />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostGraduateSubjects;