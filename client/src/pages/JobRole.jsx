import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobsAPI } from "../services/api";
import JobCard from "../components/JobCard";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FilterModal = ({
  isOpen,
  onClose,
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onCategoryToggle,
  onTagToggle,
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
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with decorative elements */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700/50">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                <span className="p-2 bg-purple-500/20 rounded-lg">
                  <SlidersHorizontal className="w-6 h-6 text-purple-400" />
                </span>
                Filters
              </h2>
              <p className="text-sm text-gray-400 ml-14">Refine your job search</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-xl hover:bg-gray-700/50 hover:rotate-90 transform"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {/* Categories Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold text-purple-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <motion.label
                    key={category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center gap-3 text-gray-200 capitalize p-3 rounded-xl hover:bg-purple-500/10 transition-all duration-300 cursor-pointer group border border-transparent hover:border-purple-500/30"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => onCategoryToggle(category)}
                      className="w-5 h-5 rounded border-gray-500 text-purple-500 focus:ring-purple-600 focus:ring-offset-gray-800 bg-gray-700/50 transition-all duration-300"
                    />
                    <span className="group-hover:text-white transition-colors">
                      {category.replace("-", " ")}
                    </span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Job Type Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-purple-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Job Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((t, index) => (
                  <motion.button
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onTagToggle(t)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
                      selectedTags.includes(t)
                        ? 'bg-purple-500/30 border-purple-400/60 text-purple-100 shadow-lg shadow-purple-500/20'
                        : 'bg-gray-700/40 border-gray-600/60 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500'
                    }`}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReset}
              className="px-6 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300 font-medium border border-gray-600/50 hover:border-gray-500"
            >
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onApply}
              className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-300 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Apply Filters
            </motion.button>
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
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [...new Set(jobs.map((job) => job.category).filter(Boolean))];
  const tags = [...new Set(jobs.map((job) => job.tag).filter(Boolean))];

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const { data } = await jobsAPI.getAll({ sort: sortBy });
        if (!ignore && data?.jobs) setJobs(data.jobs);
      } catch (e) {
        console.error(e);
        if (!ignore) setError(e?.response?.data?.message || 'Failed to load jobs');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [sortBy]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const displayedJobs = jobs.filter((job) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(job.category);
    const matchesQuery =
      query.trim() === "" || job.title.toLowerCase().includes(query.toLowerCase());
    const matchesTag = selectedTags.length === 0 || selectedTags.includes(job.tag);
    return matchesCategory && matchesQuery && matchesTag;
  });

  const parseSalaryMax = (salary) => {
    if (!salary) return 0;
    // Expect format like "₹8,00,000 - ₹25,00,000"
    const parts = String(salary).match(/([0-9,]+)/g);
    if (!parts || parts.length === 0) return 0;
    const last = parts[parts.length - 1].replace(/,/g, "");
    const n = parseInt(last, 10);
    return Number.isNaN(n) ? 0 : n;
  };

  const sortedJobs = [...displayedJobs].sort((a, b) => {
    switch (sortBy) {
      case "salary-desc":
        return parseSalaryMax(b.salary) - parseSalaryMax(a.salary);
      case "a-z":
        return a.title.localeCompare(b.title);
      case "remote": {
        const aR = String(a.location || "").toLowerCase().includes("remote") ? 1 : 0;
        const bR = String(b.location || "").toLowerCase().includes("remote") ? 1 : 0;
        return bR - aR || a.title.localeCompare(b.title);
      }
      case "newest":
      default:
        return new Date(b.startDate) - new Date(a.startDate);
    }
  });

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setQuery("");
    setShowFilter(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore a wide range of roles and internships to kickstart your career.
          </p>
        </header>

        <div className="bg-black/20 backdrop-blur-lg border border-pink-500/20 rounded-xl p-4 mb-4 sticky top-4 z-40 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
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
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="salary-desc">Highest Salary</option>
              <option value="a-z">A → Z</option>
              <option value="remote">Remote First</option>
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilter(true)}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30 border border-purple-500/30 relative"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {(selectedCategories.length > 0 || selectedTags.length > 0) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg shadow-pink-500/50"
              >
                {selectedCategories.length + selectedTags.length}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Roles', value: jobs.length },
            { label: 'Remote', value: jobs.filter(j => String(j.location||'').toLowerCase().includes('remote')).length },
            { label: 'Highest Salary', value: `₹${(Math.max(...jobs.map(j=>parseInt(String(j.salary).match(/([0-9,]+)/g)?.pop()?.replace(/,/g,'')||'0',10)))||0).toLocaleString('en-IN')}` },
            { label: 'Categories', value: categories.length },
          ].map((s, i) => (
            <div key={i} className="text-center bg-gray-800/40 border border-gray-700/60 rounded-lg py-2">
              <div className="text-xs text-gray-400">{s.label}</div>
              <div className="text-lg font-semibold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          categories={categories}
          tags={tags}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          onCategoryToggle={handleCategoryToggle}
          onTagToggle={handleTagToggle}
          onApply={() => setShowFilter(false)}
          onReset={resetFilters}
        />

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {loading ? (
              <div className="text-gray-400 col-span-full text-center mt-16">Loading jobs...</div>
            ) : error ? (
              <div className="text-rose-400 col-span-full text-center mt-16">{String(error)}</div>
            ) : sortedJobs.length > 0 ? (
              sortedJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Link to={`/jobs/${job._id}`} className="block h-full">
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
