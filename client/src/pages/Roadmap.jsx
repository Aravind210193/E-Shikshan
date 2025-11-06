import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import roadmaps from "../Roadmap/skills.json";
import { Search, Tag, ArrowRight, Star, Users, BookOpen, TrendingUp, Clock, Sparkles, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RoadmapCard = ({ roadmap, index }) => {
  const isNew = roadmap.isNew || false;
  const isUpdated = roadmap.isUpdated || false;
  const isTrending = (roadmap.trending || 0) > 50;

  return (
    <Link to={`/roadmaps/${roadmap.id}`} className="block h-full group">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="h-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]"
      >
        <div className="p-6 flex flex-col justify-between h-full relative">
          {(isNew || isUpdated || isTrending) && (
            <div className="absolute top-4 right-4 flex gap-2">
              {isNew && (
                <span className="px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30 flex items-center gap-1">
                  <Sparkles size={12} />
                  NEW
                </span>
              )}
              {isUpdated && !isNew && (
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30 flex items-center gap-1">
                  <Clock size={12} />
                  UPDATED
                </span>
              )}
              {isTrending && (
                <span className="px-2.5 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/30 flex items-center gap-1">
                  <TrendingUp size={12} />
                  TRENDING
                </span>
              )}
            </div>
          )}

          <div>
            <h3 className="text-2xl font-bold text-white mb-3 pr-20 group-hover:text-blue-400 transition-colors leading-tight">
              {roadmap.title}
            </h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed min-h-[40px]">
              {roadmap.tagline}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold">{(roadmap.rating || 0).toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Users size={14} />
                  <span className="text-sm font-bold">{((roadmap.enrolled || 0) / 1000).toFixed(0)}K</span>
                </div>
                <p className="text-xs text-gray-400">Learners</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 bg-gray-700/20 px-2.5 py-1.5 rounded-md">
                <BookOpen size={12} />
                <span>{roadmap.path?.length || 10} Chapters</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-700/20 px-2.5 py-1.5 rounded-md">
                <Clock size={12} />
                <span>{roadmap.duration || '12-16 weeks'}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  roadmap.difficulty?.includes('Beginner') ? 'bg-green-500/20 text-green-400' :
                  roadmap.difficulty?.includes('Advanced') ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {roadmap.difficulty || 'Intermediate'}
                </span>
              </div>
              <div className="text-blue-400 flex items-center gap-1.5 group-hover:text-blue-300 transition-colors font-medium">
                <span className="text-sm">View Roadmap</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default function Roadmap() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState('popular');

  const categories = useMemo(() => ["All", ...new Set(roadmaps.map((r) => r.category))], []);

  const derivedRoadmaps = useMemo(() => roadmaps.map((r, idx) => {
    const diff = (r.difficulty || '').toLowerCase();
    const pop = (r.popularity || '').toLowerCase();
    const fallbackRating = diff.includes('beginner') ? 4.6 : diff.includes('advanced') ? 4.7 : 4.5;
    const fallbackEnrolled = pop.includes('very') ? 120000 : pop.includes('popular') ? 60000 : 25000;
    const createdBase = new Date(2025, 0, 1);
    const createdDate = r.createdDate ? new Date(r.createdDate) : new Date(createdBase.getTime() + idx * 86400000);
    const trending = r.trending ?? ((r.path?.length || 10) * 3 + (idx % 7));
    return {
      ...r,
      rating: r.rating ?? fallbackRating,
      enrolled: r.enrolled ?? fallbackEnrolled,
      createdDate,
      trending
    };
  }), []);

  const filteredRoadmaps = useMemo(() => {
    let list = derivedRoadmaps.filter((roadmap) => {
      const matchesCategory = selectedCategory === "All" || roadmap.category === selectedCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q ||
        roadmap.title.toLowerCase().includes(q) ||
        (roadmap.category || '').toLowerCase().includes(q) ||
        (roadmap.tagline || '').toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });

    switch (sortBy) {
      case 'newest':
        list = list.sort((a, b) => (b.createdDate?.getTime?.() || 0) - (a.createdDate?.getTime?.() || 0));
        break;
      case 'top-rated':
        list = list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'trending':
        list = list.sort((a, b) => (b.trending || 0) - (a.trending || 0));
        break;
      case 'popular':
      default:
        list = list.sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0));
        break;
    }

    return list;
  }, [query, selectedCategory, sortBy, derivedRoadmaps]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent px-4">
              Developer Roadmaps
            </h1>
            <p className="max-w-3xl mx-auto text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed px-4">
              Step-by-step guides and paths to learn different tools or technologies. 
              <br className="hidden sm:block" />
              Choose your path and start your learning journey today.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{roadmaps.length} Roadmaps Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Updated Weekly</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 sticky top-4 z-30 bg-gradient-to-br from-gray-800/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl p-6 rounded-3xl border border-purple-500/20 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Search Input */}
            <motion.div 
              className="relative flex-grow"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="text"
                placeholder="Search roadmaps by title, category, or tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-700/50 border-2 border-gray-600/50 rounded-2xl pl-14 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all hover:border-gray-500 font-medium"
              />
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </motion.button>
              )}
            </motion.div>

            {/* Filters */}
            <div className="flex gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-gradient-to-br from-blue-600/80 to-blue-700/80 border-2 border-blue-500/30 rounded-2xl pl-5 pr-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all cursor-pointer font-semibold shadow-lg hover:shadow-blue-500/30 min-w-[140px]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-800">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={20} />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gradient-to-br from-purple-600/80 to-purple-700/80 border-2 border-purple-500/30 rounded-2xl pl-5 pr-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all cursor-pointer font-semibold shadow-lg hover:shadow-purple-500/30 min-w-[140px]"
                >
                  <option value="popular" className="bg-gray-800">Most Popular</option>
                  <option value="newest" className="bg-gray-800">Newest</option>
                  <option value="top-rated" className="bg-gray-800">Top Rated</option>
                  <option value="trending" className="bg-gray-800">Trending</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={20} />
              </motion.div>
            </div>
          </div>

          {/* Active Filters Count */}
          {(selectedCategory !== 'All' || query) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30 font-medium">
                  {filteredRoadmaps.length} {filteredRoadmaps.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setQuery(''); setSelectedCategory('All'); }}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <X size={16} />
                Clear filters
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Roadmaps Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${sortBy}-${query}`}
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRoadmaps.map((roadmap, index) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredRoadmaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-6">
              <Search size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-300">No Roadmaps Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedCategory("All");
                setSortBy("popular");
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
