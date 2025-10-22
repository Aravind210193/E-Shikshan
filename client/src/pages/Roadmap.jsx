import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import roadmaps from "../Roadmap/skills.json";
import { Search, Tag, ArrowRight, Star, Users, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RoadmapCard = ({ roadmap }) => (
  <Link to={`/roadmaps/${roadmap.id}`} className="block h-full group">
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-500/5"
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{roadmap.title}</h3>
          <p className="text-gray-400 mb-4 text-sm h-10 line-clamp-2">{roadmap.tagline}</p>
        </div>
        <div className="mt-auto">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-gray-500" />
              <span>{roadmap.difficulty || "Intermediate"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-gray-500" />
              <span>{roadmap.popularity || "Popular"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-gray-500" />
              <span>{roadmap.path?.length || "10"}+ Topics</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Tag size={14} />
              <span>{roadmap.category}</span>
            </div>
            <div className="text-gray-300 flex items-center gap-1 group-hover:text-white transition-colors">
              <span className="text-sm font-medium">View Roadmap</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function Roadmap() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(roadmaps.map((r) => r.category))], []);

  const filteredRoadmaps = useMemo(() => roadmaps.filter((roadmap) => {
    const matchesCategory =
      selectedCategory === "All" || roadmap.category === selectedCategory;
    const matchesQuery =
      query.trim() === "" ||
      roadmap.title.toLowerCase().includes(query.toLowerCase()) ||
      roadmap.category.toLowerCase().includes(query.toLowerCase()) ||
      roadmap.tagline.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [query, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 text-white">
            Developer Roadmaps
          </h1>
          <p className="max-w-3xl mx-auto text-gray-400 text-base sm:text-lg">
            Step-by-step guides and paths to learn different tools or technologies. Follow these roadmaps to become a developer, or to grow in your current role.
          </p>
        </div>

        <div className="mb-10 sticky top-4 z-30 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for a roadmap..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md pl-12 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-gray-800 border border-gray-700 rounded-md px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredRoadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredRoadmaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <h3 className="text-2xl font-semibold mb-2">No Roadmaps Found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}