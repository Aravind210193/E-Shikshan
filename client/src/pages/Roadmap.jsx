import { useState } from "react";
import { Link } from "react-router-dom";
import roadmaps from "../Roadmap/skills.json";
import { Search, Tag, ArrowRight, Clock, BarChart3, Users, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RoadmapCard = ({ roadmap }) => (
  <Link to={`/roadmaps/${roadmap.id}`} className="block h-full">
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:border-pink-500/50 hover:shadow-pink-500/20"
    >
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/70 to-pink-600/70 opacity-80 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnptLTYtMmgtMlYwaDF2MzJoMXpNMjIgMzBoLTJWMGgydjMwem0tNCAwVjBoLTJ2MzBoMnptLTYgMGgtMlYwaDF2MzBoMXptLTYtMmgtMlYwaDF2MjhoMXptLTYtMmgtMlYwaDJ2MjZ6TTAgMjRoMnYySDAnIi8+PC9nPjwvZz48L3N2Zz4=')]" />
        <img
          src={roadmap.image || `https://placehold.co/600x400/3d0053/FFFFFF.png?text=${roadmap.title}&font=montserrat`}
          alt={roadmap.title}
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h3 className="text-3xl font-bold text-white px-6 text-center">{roadmap.title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-300 mb-5 h-12 line-clamp-2">{roadmap.tagline}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <BarChart3 size={14} />
            <span>{roadmap.difficulty || "Intermediate"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={14} />
            <span>{roadmap.duration || "8-10 weeks"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={14} />
            <span>{roadmap.popularity || "Popular"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <BookOpen size={14} />
            <span>{roadmap.path?.length || "10"}+ topics</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-sm text-purple-300">
            <Tag size={14} />
            <span>{roadmap.category}</span>
          </div>
          <div className="text-pink-500 flex items-center gap-1 group-hover:text-pink-400 transition-colors">
            <span className="text-sm font-medium">Explore</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function Roadmap() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(roadmaps.map((r) => r.category))];

  // Group roadmaps by category for featured section
  const groupedRoadmaps = roadmaps.reduce((acc, roadmap) => {
    if (!acc[roadmap.category]) {
      acc[roadmap.category] = [];
    }
    acc[roadmap.category].push(roadmap);
    return acc;
  }, {});

  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    const matchesCategory =
      selectedCategory === "All" || roadmap.category === selectedCategory;
    const matchesQuery =
      query.trim() === "" ||
      roadmap.title.toLowerCase().includes(query.toLowerCase()) ||
      roadmap.category.toLowerCase().includes(query.toLowerCase()) ||
      roadmap.tagline.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden mb-16 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-800 opacity-80 z-0"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnptLTYtMmgtMlYwaDF2MzJoMXpNMjIgMzBoLTJWMGgydjMwem0tNCAwVjBoLTJ2MzBoMnptLTYgMGgtMlYwaDF2MzBoMXptLTYtMmgtMlYwaDF2MjhoMXptLTYtMmgtMlYwaDJ2MjZ6TTAgMjRoMnYySDAnIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 z-0"></div>
          
          <div className="relative z-10 px-6 py-16 sm:py-24 lg:py-32 text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                Developer Roadmaps
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              Step-by-step guides and interactive learning paths to become a modern developer.
              Choose your path and start your journey today.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search roadmaps (e.g., Frontend, Backend, DevOps)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all text-lg shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="sticky top-4 z-40 bg-black/30 backdrop-blur-lg border border-gray-800 rounded-xl p-4 mb-10 flex flex-wrap justify-center gap-3 shadow-lg">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Sections (if not searching or filtering) */}
        {query === "" && selectedCategory === "All" && (
          <div className="mb-16 space-y-16">
            {Object.entries(groupedRoadmaps).slice(0, 3).map(([category, categoryRoadmaps]) => (
              <section key={category}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                    {category} Roadmaps
                  </h2>
                  <button 
                    onClick={() => setSelectedCategory(category)}
                    className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryRoadmaps.slice(0, 3).map(roadmap => (
                    <RoadmapCard key={roadmap.id} roadmap={roadmap} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* All/Filtered Roadmaps */}
        <div>
          {(query !== "" || selectedCategory !== "All") && (
            <h2 className="text-2xl font-bold mb-6">
              {query !== "" 
                ? `Search Results for "${query}"` 
                : `${selectedCategory} Roadmaps`}
            </h2>
          )}

          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredRoadmaps.length > 0 ? (
                filteredRoadmaps.map((roadmap) => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 col-span-full text-center py-16"
                >
                  <h3 className="text-2xl font-semibold mb-2">No Roadmaps Found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Call to Action */}
        <div className="mt-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 sm:p-12 text-center border border-purple-700/30 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            We're constantly adding new roadmaps based on community feedback.
            Let us know what topic you'd like to see next!
          </p>
          <button className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors">
            Request a Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}