import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import roadmaps from "../Roadmap/skills.json";
import { Check, ExternalLink, ChevronDown, Search, CheckCircle, ArrowRight, Lock, Clock, BookOpen, CheckSquare, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Topic card component
const TopicCard = ({ topic, index, onClick, isCompleted = false }) => {
  return (
    <div 
      onClick={() => onClick(topic)}
      className={`relative group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] ${
        isCompleted 
          ? "bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-green-500/30" 
          : "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 hover:border-pink-500/40"
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-70"></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
              isCompleted ? "bg-green-500" : "bg-gray-700"
            }`}>
              {isCompleted ? (
                <CheckSquare size={20} />
              ) : (
                <span className="font-bold">{index + 1}</span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white">{topic.title}</h3>
          </div>
          <div className={`rounded-full p-1 ${
            isCompleted ? "text-green-400" : "text-pink-400 group-hover:translate-x-1 transition-transform"
          }`}>
            {isCompleted ? <Check size={18} /> : <ArrowRight size={18} />}
          </div>
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-2">{topic.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {topic.topics && topic.topics.slice(0, 3).map((subtopic, i) => (
            <span key={i} className="bg-gray-800/70 text-gray-300 text-xs py-1 px-2 rounded-md">
              {subtopic}
            </span>
          ))}
          {topic.topics && topic.topics.length > 3 && (
            <span className="bg-gray-800/70 text-gray-400 text-xs py-1 px-2 rounded-md">
              +{topic.topics.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-blue-400">
            <BookOpen size={14} />
            <span>{topic.resources?.length || 0} resources</span>
          </div>
          {topic.project && (
            <div className="flex items-center gap-1 text-purple-400">
              <Code size={14} />
              <span>Project included</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Topic detail component 
const TopicDetail = ({ topic, onClose, isActive }) => {
  if (!topic) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/10"
        onClick={e => e.stopPropagation()}
        layoutId={`topic-card-${isActive}`}
      >
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/60 p-6 border-b border-gray-700/50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            {topic.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-6 rounded-xl border border-gray-700/50">
            <p className="text-lg text-gray-200 leading-relaxed">{topic.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1.5 bg-purple-900/50 rounded-full text-purple-300 text-sm flex items-center gap-1.5 border border-purple-500/30">
                <CheckCircle size={14} />
                <span>Core Knowledge</span>
              </div>
              <div className="px-3 py-1.5 bg-blue-900/50 rounded-full text-blue-300 text-sm flex items-center gap-1.5 border border-blue-500/30">
                <Clock size={14} />
                <span>2-3 Weeks</span>
              </div>
            </div>
          </div>

          {topic.topics && topic.topics.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                <CheckCircle size={20} className="text-purple-400" />
                Key Topics to Master
              </h3>
              <div className="grid gap-3">
                {topic.topics.map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 min-w-[20px] w-5 h-5 rounded-full bg-purple-900/60 flex items-center justify-center text-xs font-bold text-purple-300 border border-purple-500/50">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-gray-200">{item}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topic.resources && topic.resources.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                <BookOpen size={20} className="text-blue-400" />
                Learning Resources
              </h3>
              <div className="grid gap-3">
                {topic.resources.map((resource, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-[24px] w-6 h-6 rounded-md bg-blue-900/60 flex items-center justify-center text-blue-300 border border-blue-500/50">
                        <ExternalLink size={14} />
                      </div>
                      <div className="text-blue-200 group-hover:text-blue-300 transition-colors">{resource}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {topic.project && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
                <Code size={20} className="text-pink-400" />
                Practice Project
              </h3>
              <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 p-6 rounded-xl border border-pink-500/30">
                <p className="text-gray-200 leading-relaxed">{topic.project}</p>
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-colors">
                    Start Project <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Progress tracking component
const ProgressBar = ({ current, total }) => {
  const percent = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-700 ease-out"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

// Roadmap section component with collapsible content
const RoadmapSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800">
      <button 
        className="w-full px-6 py-4 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default function RoadmapDetail() {
  const { id } = useParams();
  const roadmap = roadmaps.find((r) => r.id === id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  
  // Filter topics based on search query
  const filteredTopics = roadmap?.path?.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.topics?.some(subtopic => subtopic.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // Handle completing a topic
  const toggleTopicCompletion = (topicIndex) => {
    setCompletedTopics(prev => {
      if (prev.includes(topicIndex)) {
        return prev.filter(i => i !== topicIndex);
      } else {
        return [...prev, topicIndex];
      }
    });
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Roadmap Not Found</h1>
        <p className="text-gray-400 mb-8">
          We couldn't find the roadmap you were looking for.
        </p>
        <Link
          to="/roadmaps"
          className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg font-semibold text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
        >
          Back to All Roadmaps
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[90px] flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/roadmaps" className="mr-4 text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"></path>
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {roadmap.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800/70 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnptLTYtMmgtMlYwaDF2MzJoMXpNMjIgMzBoLTJWMGgydjMwem0tNCAwVjBoLTJ2MzBoMnptLTYgMGgtMlYwaDF2MzBoMXptLTYtMmgtMlYwaDF2MjhoMXptLTYtMmgtMlYwaDJ2MjZ6TTAgMjRoMnYySDAnIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                    About This Roadmap
                  </h2>
                  <p className="text-gray-200 text-lg mb-6">{roadmap.description}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                      <div className="text-purple-400 text-sm mb-1">Difficulty</div>
                      <div className="font-semibold">{roadmap.difficulty || "Intermediate"}</div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                      <div className="text-purple-400 text-sm mb-1">Duration</div>
                      <div className="font-semibold">{roadmap.duration || "8-10 weeks"}</div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                      <div className="text-purple-400 text-sm mb-1">Topics</div>
                      <div className="font-semibold">{roadmap.path?.length || "10"}+ topics</div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                      <div className="text-purple-400 text-sm mb-1">Category</div>
                      <div className="font-semibold">{roadmap.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-300 text-sm mb-2">Your progress</div>
                      <ProgressBar 
                        current={completedTopics.length} 
                        total={roadmap.path?.length || 0} 
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">
                        {Math.round((completedTopics.length / (roadmap.path?.length || 1)) * 100)}%
                      </div>
                      <div className="text-gray-400 text-sm">
                        {completedTopics.length}/{roadmap.path?.length} completed
                      </div>
                    </div>
                  </div>
                </div>

                {roadmap.image && (
                  <div className="w-full md:w-80 h-60 rounded-xl overflow-hidden border border-purple-500/20">
                    <img 
                      src={roadmap.image} 
                      alt={roadmap.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Path */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Learning Path
            </h2>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-300">Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-gray-600"></span>
                <span className="text-gray-300">Not Started</span>
              </div>
            </div>
          </div>

          {searchQuery && filteredTopics.length === 0 ? (
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
              <p className="text-gray-400 mb-2">No topics found matching "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Left side connector line */}
              <div className="absolute left-5 top-10 bottom-20 w-1 bg-gradient-to-b from-pink-500 to-purple-700 rounded-full"></div>
              
              {(searchQuery ? filteredTopics : roadmap.path).map((topic, index) => {
                const isCompleted = completedTopics.includes(index);
                
                return (
                  <div key={index} className="mb-6 relative">
                    {/* Connector dot */}
                    <div className={`absolute left-5 top-10 w-3 h-3 rounded-full transform -translate-x-1 -translate-y-1 z-10 ${
                      isCompleted ? "bg-green-500" : "bg-gray-600"
                    }`}></div>
                    
                    <div className="pl-14">
                      <TopicCard 
                        topic={topic}
                        index={index}
                        isCompleted={isCompleted}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setActiveTopicIndex(index);
                        }}
                      />
                    </div>

                    {/* Mark as complete button */}
                    <button 
                      className={`absolute left-0 top-10 transform -translate-y-1/2 bg-gray-800 rounded-full p-1.5 border ${
                        isCompleted 
                          ? "border-green-500 text-green-500 hover:bg-green-900/30" 
                          : "border-gray-600 text-gray-400 hover:bg-gray-700/50"
                      }`}
                      onClick={() => toggleTopicCompletion(index)}
                    >
                      <CheckSquare size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Community Section */}
        <RoadmapSection title="Community Resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-900/60 flex items-center justify-center text-blue-300 border border-blue-500/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Discussion Forum</h3>
              </div>
              <p className="text-gray-300 mb-4">Join our community forum to ask questions and get help from other learners following this roadmap.</p>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                Join Discussion <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-900/60 flex items-center justify-center text-purple-300 border border-purple-500/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Video Tutorials</h3>
              </div>
              <p className="text-gray-300 mb-4">Watch comprehensive video tutorials that complement this roadmap and guide you through each topic.</p>
              <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                Access Videos <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </RoadmapSection>
      </div>

      <AnimatePresence>
        {selectedTopic && (
          <TopicDetail 
            topic={selectedTopic} 
            isActive={activeTopicIndex}
            onClose={() => {
              setSelectedTopic(null);
              setActiveTopicIndex(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
