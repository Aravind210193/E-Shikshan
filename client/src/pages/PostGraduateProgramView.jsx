import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Users, Star, Award, Briefcase, Code, FlaskConical, ChevronRight } from 'lucide-react';
import semesterData from '../data/semesterData.json';

const PostGraduateProgramView = () => {
  const { program } = useParams();
  const navigate = useNavigate();
  const pgData = semesterData.postgraduate;
  const programData = pgData?.programs?.[program];

  if (!programData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
          <p className="text-gray-400">Could not find data for the "{program}" program.</p>
          <button
            onClick={() => navigate('/content')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Back to Content
          </button>
        </div>
      </div>
    );
  }

  const getProgramIcon = (programName) => {
    switch(programName) {
      case 'mba': return Briefcase;
      case 'mtech': return Code;
      case 'msc': return FlaskConical;
      default: return Award;
    }
  };

  const IconComponent = getProgramIcon(program);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/content')}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>
              <div className="flex items-center gap-3">
                <IconComponent className="h-7 w-7 text-blue-400" />
                <h1 className='text-xl font-bold text-white'>{programData.name}</h1>
              </div>
            </div>
            <p className="text-sm text-gray-400 hidden md:block">
              Advanced postgraduate curriculum for professional excellence.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {program === 'mba' ? 'Semesters' : 'Available Specializations'}
          </h2>

          {program === 'mba' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(programData.semesters).map(([semId, semData], index) => (
                <Card
                  key={semId}
                  title={semData.name}
                  icon={<BookOpen />}
                  link={`/postgraduate/mba//${semId}`}
                  stats={[
                    { icon: <Users />, label: `${semData.subjects.length} Subjects` },
                    { icon: <Star />, label: `${semData.subjects.reduce((total, subject) => total + subject.credits, 0)} Credits` },
                  ]}
                  index={index}
                />
              ))}
            </div>
          )}

          {program !== 'mba' && programData.specializations && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(programData.specializations).map(([specId, specData], index) => (
                <SpecializationCard
                  key={specId}
                  specId={specId}
                  specData={specData}
                  program={program}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

const Card = ({ title, icon, link, stats, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 cursor-pointer group"
      onClick={() => navigate(link)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-blue-400">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
      </div>
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2">
            {stat.icon}
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SpecializationCard = ({ specId, specData, program, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-blue-400">
            <Award />
          </div>
          <h3 className="text-lg font-semibold text-white">{specData.name}</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">Choose a semester to view subjects:</p>
      </div>
      <div className="bg-gray-800 px-6 py-4 space-y-2">
        {Object.entries(specData.semesters).map(([semId, semData]) => (
          <motion.button
            key={semId}
            whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.8)' }}
            onClick={() => navigate(`/postgraduate/${program}/${specId}/${semId}`)}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700/50 text-left"
          >
            <span className="font-medium text-white">{semData.name}</span>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PostGraduateProgramView;