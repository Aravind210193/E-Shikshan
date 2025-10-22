import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import roadmaps from "../Roadmap/skills.json";
import { Check, ExternalLink, ChevronDown, Search, CheckCircle, ArrowRight, Lock, Clock, BookOpen, CheckSquare, Code, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TopicCard = ({ topic, index, onClick, isCompleted, isNext }) => {
  return (
    <div 
      onClick={() => onClick(topic)}
      className={`relative group cursor-pointer rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isCompleted 
          ? "bg-gray-800/30 border-green-500/30" 
          : isNext
          ? "bg-purple-900/20 border-purple-500/50 shadow-lg shadow-purple-500/10"
          : "bg-gray-800/50 border-gray-700/50 hover:border-purple-500/40"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
              isCompleted ? "bg-green-500" : isNext ? "bg-purple-500" : "bg-gray-700"
            }`}>
              {isCompleted ? <Check size={20} /> : index + 1}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>{topic.title}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{topic.description}</p>
            </div>
          </div>
          <div className={`rounded-full p-1 transition-all duration-300 ${
            isCompleted ? "text-green-400" : isNext ? "text-purple-300" : "text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5"
          }`}>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
      {isNext && (
        <div className="absolute -top-2 -right-2">
          <div className="relative">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping-slow opacity-50"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const TopicDetail = ({ topic, onClose }) => {
  if (!topic) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900/80 p-5 border-b border-gray-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {topic.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-300 leading-relaxed">{topic.description}</p>

          {topic.topics && topic.topics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-300">
                <CheckCircle size={18} />
                Key Topics
              </h3>
              <ul className="space-y-2">
                {topic.topics.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topic.resources && topic.resources.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-300">
                <BookOpen size={18} />
                Learning Resources
              </h3>
              <div className="space-y-2">
                {topic.resources.map((resource, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
                  >
                    <ExternalLink size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="text-blue-300 group-hover:underline">{resource}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {topic.project && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-pink-300">
                <Code size={18} />
                Practice Project
              </h3>
              <div className="p-4 bg-pink-900/20 rounded-lg border border-pink-500/30">
                <p className="text-gray-300 mb-3">{topic.project}</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 rounded-md text-white font-medium hover:bg-pink-700 transition-colors text-sm">
                  Start Project <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProgressBar = ({ current, total }) => {
  const percent = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <motion.div 
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export default function RoadmapDetail() {
  const { id } = useParams();
  const roadmap = useMemo(() => roadmaps.find((r) => r.id === id), [id]);
  
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(`roadmap-progress-${id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    localStorage.setItem(`roadmap-progress-${id}`, JSON.stringify(completedTopics));
  }, [completedTopics, id]);

  const toggleTopicCompletion = (topicIndex) => {
    setCompletedTopics(prev => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(topicIndex)) {
        newCompleted.delete(topicIndex);
      } else {
        newCompleted.add(topicIndex);
      }
      return Array.from(newCompleted);
    });
  };

  const nextTopicIndex = useMemo(() => {
    if (!roadmap) return -1;
    return roadmap.path.findIndex((_, index) => !completedTopics.includes(index));
  }, [completedTopics, roadmap]);

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Roadmap Not Found</h1>
        <p className="text-gray-400 mb-8">We couldn't find the roadmap you were looking for.</p>
        <Link to="/roadmaps" className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity">
          Back to All Roadmaps
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/roadmaps" className="text-gray-400 hover:text-white transition-colors">
                <ArrowRight size={20} className="rotate-180" />
              </Link>
              <h1 className="text-xl font-bold text-white">{roadmap.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                {completedTopics.length} / {roadmap.path.length} Completed
              </div>
              <button className="text-sm text-purple-400 hover:text-purple-300" onClick={() => setCompletedTopics([])}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-gray-400 mb-4">{roadmap.description}</p>
          <ProgressBar current={completedTopics.length} total={roadmap.path.length} />
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
          
          <div className="space-y-4">
            {roadmap.path.map((topic, index) => {
              const isCompleted = completedTopics.includes(index);
              const isNext = index === nextTopicIndex;
              
              return (
                <div key={index} className="flex items-center gap-6">
                  <div className="relative z-10">
                    <button 
                      onClick={() => toggleTopicCompletion(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted 
                          ? "bg-green-500 border-green-400 text-white" 
                          : isNext
                          ? "bg-purple-500 border-purple-400 text-white"
                          : "bg-gray-800 border-gray-600 text-gray-500 hover:border-purple-500"
                      }`}
                    >
                      {isCompleted ? <Check size={16} /> : <div className="w-2 h-2 bg-gray-500 rounded-full"></div>}
                    </button>
                  </div>
                  <div className="flex-1">
                    <TopicCard 
                      topic={topic}
                      index={index}
                      isCompleted={isCompleted}
                      isNext={isNext}
                      onClick={() => setSelectedTopic(topic)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedTopic && (
          <TopicDetail 
            topic={selectedTopic} 
            onClose={() => setSelectedTopic(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
