import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jobData from "../data/jobProfile.json";
import JobCard from "../components/JobCard";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FilterModal = ({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  onCheckboxChange,
  onApply,
  onReset,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Filter by Category
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 text-gray-200 capitalize p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCheckboxChange(category)}
                  className="w-5 h-5 rounded border-gray-500 text-pink-500 focus:ring-purple-600 focus:ring-offset-gray-800 bg-gray-800"
                />
                {category.replace("-", " ")}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={onReset}
              className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300 font-medium"
            >
              Reset
            </button>
            <button
              onClick={onApply}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-semibold"
            >
              Apply
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function JobRole() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [query, setQuery] = useState("");

  const categories = [...new Set(jobData.map((job) => job.category))];

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const displayedJobs = jobData.filter((job) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(job.category);
    const matchesQuery =
      query.trim() === "" || job.title.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const resetFilters = () => {
    setSelectedCategories([]);
    setQuery("");
    setShowFilter(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore a wide range of roles and internships to kickstart your career.
          </p>
        </header>

        <div className="bg-black/20 backdrop-blur-lg border border-pink-500/20 rounded-xl p-4 mb-8 sticky top-4 z-40 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
          <div className="relative w-full flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by job title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          categories={categories}
          selectedCategories={selectedCategories}
          onCheckboxChange={handleCheckboxChange}
          onApply={() => setShowFilter(false)}
          onReset={resetFilters}
        />

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Link to={`/jobs/${job.id}`} className="block h-full">
                    <JobCard job={job} />
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 col-span-full text-center mt-16"
              >
                <h3 className="text-2xl font-semibold">No Jobs Found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
