import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ExternalLink, ChevronDown, Search, CheckCircle, ArrowRight, Lock, Clock, BookOpen, CheckSquare, Code, Zap, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import roadmapAPI from "../services/roadmapApi";
import { projectSubmissionAPI } from "../services/api";
import { toast } from "react-hot-toast";

const TopicCard = ({ topic, index, onClick, isCompleted, isNext }) => {
  return (
    <div
      onClick={() => onClick(topic)}
      className={`relative group cursor-pointer rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isCompleted
        ? "bg-gray-800/30 border-green-500/30"
        : isNext
          ? "bg-purple-900/20 border-purple-500/50 shadow-lg shadow-purple-500/10"
          : "bg-gray-800/50 border-gray-700/50 hover:border-purple-500/40"
        }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${isCompleted ? "bg-green-500" : isNext ? "bg-purple-500" : "bg-gray-700"
              }`}>
              {isCompleted ? <Check size={20} /> : index + 1}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>{topic.title}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{topic.description}</p>
            </div>
          </div>
          <div className={`rounded-full p-1 transition-all duration-300 ${isCompleted ? "text-green-400" : isNext ? "text-purple-300" : "text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5"
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

import { projectSubmissionAPI } from "../services/api";
import { toast } from "react-hot-toast";

const SubmissionModal = ({ isOpen, onClose, onSubmit, submitting, topic }) => {
  const [url, setUrl] = useState("");
  const [comments, setComments] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ submissionUrl: url, comments });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Submit Project</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Project Link (GitHub/Deployed URL)</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
              placeholder="https://github.com/username/project"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Comments (Optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors h-24 resize-none"
              placeholder="Any notes for the instructor..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const TopicDetail = ({ topic, onClose, onOpenSubmission }) => {
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
            <X size={20} />
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
                {topic.resources.map((resource, i) => {
                  const getDummyUrl = (resourceName) => {
                    // ... existing helper (can be moved out or duplicated if needed, but for now we assume it's fine or we can simplify)
                    return 'https://google.com/search?q=' + encodeURIComponent(typeof resource === 'string' ? resource : resource.title);
                  };
                  const url = typeof resource === 'object' ? resource.url : getDummyUrl(resource);
                  const title = typeof resource === 'object' ? resource.title : resource;

                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      <ExternalLink size={16} className="text-blue-400 flex-shrink-0" />
                      <span className="text-blue-300 group-hover:underline">{title}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {topic.project && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-pink-300">
                <Code size={18} />
                Practice Project
              </h3>
              <div className="p-5 bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg border border-pink-500/40 shadow-lg">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center flex-shrink-0">
                    <Code size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Build a Real Project</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{topic.project}</p>
                    {topic.projectId && (
                      <span className="inline-block mt-2 px-2 py-1 bg-black/30 rounded text-xs font-mono text-gray-400 border border-white/10">ID: {topic.projectId}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Tags can be static or dynamic */}
                  <span className="px-3 py-1 bg-pink-600/30 text-pink-300 rounded-full text-xs font-medium border border-pink-500/30">
                    Hands-on Practice
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onOpenSubmission(topic)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-pink-600 rounded-lg text-white font-medium hover:bg-pink-700 transition-all hover:shadow-lg hover:shadow-pink-500/30"
                  >
                    <Send size={16} />
                    Submit Project
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
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(`roadmap-progress-${id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submissionTopic, setSubmissionTopic] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleOpenSubmission = (topic) => {
    setSubmissionTopic(topic);
    setIsSubmissionModalOpen(true);
  };

  const handleCloseSubmission = () => {
    setIsSubmissionModalOpen(false);
    setSubmissionTopic(null);
  };

  const handleProjectSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (!submissionTopic) return;

      const payload = {
        roadmap: roadmap._id,
        workId: submissionTopic.projectId || `step-${roadmap.path.indexOf(submissionTopic)}`, // Fallback index-based ID if no projectId
        workType: 'roadmap_project',
        title: submissionTopic.title,
        submissionUrl: data.submissionUrl,
        comments: data.comments
      };

      await projectSubmissionAPI.submit(payload);
      toast.success("Project submitted successfully!");
      handleCloseSubmission();

      // Auto-complete the topic upon submission
      const topicIndex = roadmap.path.indexOf(submissionTopic);
      if (!completedTopics.includes(topicIndex)) {
        toggleTopicCompletion(topicIndex);
      }

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit project");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch roadmap data
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const response = await roadmapAPI.getById(id);
        if (response.success) {
          setRoadmap(response.data);
        } else {
          setError('Roadmap not found');
        }
      } catch (err) {
        console.error('Failed to fetch roadmap:', err);
        setError('Failed to load roadmap. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-400 text-lg">Loading roadmap...</p>
      </div>
    );
  }

  // Error or not found state
  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Roadmap Not Found</h1>
        <p className="text-gray-400 mb-8">{error || "We couldn't find the roadmap you were looking for."}</p>
        <Link to="/roadmap" className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity">
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
              <Link to="/roadmap" className="text-gray-400 hover:text-white transition-colors">
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

      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={handleCloseSubmission}
        onSubmit={handleProjectSubmit}
        submitting={submitting}
        topic={submissionTopic}
      />

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
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
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
            onOpenSubmission={handleOpenSubmission}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
