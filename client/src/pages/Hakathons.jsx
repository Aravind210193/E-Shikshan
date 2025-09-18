import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, X, Calendar, Trophy, Tag, Flag, Users } from "lucide-react";
import hackathons from "../data/hackathons.json";
import { motion, AnimatePresence } from "framer-motion";

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(236, 72, 153, 0.5);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(236, 72, 153, 0.7);
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(236, 72, 153, 0.5) rgba(31, 41, 55, 0.5);
  }
`;

// Add styles to head
const addScrollbarStyles = () => {
  const style = document.createElement('style');
  style.textContent = scrollbarStyles;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
};

// FilterGroup Component
const FilterGroup = ({ title, options, selected, onChange }) => {
  return (
    <div className="bg-gray-700/30 rounded-lg p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              className="w-4 h-4 rounded border-gray-600 text-pink-500 focus:ring-purple-600 focus:ring-offset-gray-800"
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// HackathonCard Component
const HackathonCard = ({ hackathon, isSelected, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={`group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
      isSelected ? "ring-2 ring-pink-500" : "hover:ring-2 hover:ring-purple-500"
    }`}
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={hackathon.image}
        alt={hackathon.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white mb-1">{hackathon.title}</h3>
        <p className="text-sm text-gray-200">{hackathon.tagline}</p>
      </div>
    </div>
    <div className="p-4 bg-gray-800/90 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <Calendar className="w-4 h-4 text-pink-500" />
        <span>{hackathon.startDate} - {hackathon.endDate}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <Trophy className="w-4 h-4 text-purple-500" />
        <span>{hackathon.prize}</span>
      </div>
    </div>
  </motion.div>
);

export default function Hakathons() {
  const [selectedHackathon, setSelectedHackathon] = useState(hackathons[0]);
  const [filters, setFilters] = useState({
    user: [],
    category: [],
    payment: [],
    eventType: [],
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Unique filter options
  const users = [...new Set(hackathons.map((h) => h.user))];
  const categories = [...new Set(hackathons.map((h) => h.category))];
  const payments = [...new Set(hackathons.map((h) => h.payment))];
  const eventTypes = [...new Set(hackathons.map((h) => h.EventType))];

  // Add scrollbar styles on mount
  useEffect(() => {
    return addScrollbarStyles();
  }, []);

  // Handle modal scroll lock
  useEffect(() => {
    if (showFilterModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilterModal]);

  // Handle checkbox toggle
  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  // Clear individual filter
  const clearFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
  };

  // Filter hackathons based on selected filters
  const filteredHackathons = hackathons.filter((h) => {
    const userMatch = filters.user.length === 0 || filters.user.includes(h.user);
    const categoryMatch = filters.category.length === 0 || filters.category.includes(h.category);
    const paymentMatch = filters.payment.length === 0 || filters.payment.includes(h.payment);
    const eventTypeMatch = filters.eventType.length === 0 || filters.eventType.includes(h.EventType);
    return userMatch && categoryMatch && paymentMatch && eventTypeMatch;
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col">
      {/* Header and Filter Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-pink-500/30 px-4 sm:px-6 py-4 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Discover Hackathons
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <div className="flex gap-2 flex-wrap">
                {Object.entries(filters).map(([key, values]) =>
                  values.map((value) => (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={`${key}-${value}`}
                      className="bg-gradient-to-r from-pink-600 to-purple-700 px-3 py-1 rounded-full text-sm cursor-pointer flex items-center gap-2 hover:from-pink-700 hover:to-purple-800 transition-all duration-300 shadow-md"
                      onClick={() => clearFilter(key, value)}
                    >
                      {value} <X size={14} />
                    </motion.span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Independent Scrolling */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Panel: Hackathon Cards */}
        <div className="w-full lg:w-1/3 bg-gray-900/80 lg:h-[calc(100vh-64px)] flex flex-col border-b lg:border-b-0 lg:border-r border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
          <div className="p-4 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {filteredHackathons.length > 0 ? (
                filteredHackathons.map((hackathon) => (
                  <HackathonCard
                    key={hackathon.id}
                    hackathon={hackathon}
                    isSelected={selectedHackathon?.id === hackathon.id}
                    onClick={() => setSelectedHackathon(hackathon)}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-8 text-gray-400">
                  <Flag className="w-12 h-12 mb-4" />
                  <p className="text-lg font-semibold">No hackathons match your filters</p>
                  <p className="text-sm">Try adjusting your filters to see more results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Selected Hackathon Details */}
        <div className="flex-1 bg-gray-900/50 lg:h-[calc(100vh-64px)]">
          <div className="h-full p-4 lg:p-8 overflow-y-auto custom-scrollbar">
            {selectedHackathon ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Banner */}
                <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden mb-6 shadow-2xl">
                  <img
                    src={selectedHackathon.bgimage}
                    alt={selectedHackathon.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {selectedHackathon.title}
                      </h1>
                      <p className="text-lg text-gray-200">{selectedHackathon.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Calendar, label: "Duration", value: `${selectedHackathon.startDate} - ${selectedHackathon.endDate}` },
                    { icon: Flag, label: "Status", value: selectedHackathon.status },
                    { icon: Tag, label: "Category", value: selectedHackathon.category },
                    { icon: Trophy, label: "Prize Pool", value: selectedHackathon.prize }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                      <item.icon className="w-6 h-6 text-pink-500 mb-2" />
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className="text-base font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Overview */}
                <div className="bg-gray-800/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    Overview
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedHackathon.overview}
                  </p>
                </div>

                {/* View More Button */}
                <Link
                  to={`/hackathon/${selectedHackathon.id}`}
                  className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 rounded-lg font-semibold text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View Full Details
                </Link>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <Users className="w-16 h-16 mb-4" />
                <p className="text-xl font-semibold">Select a hackathon to view details</p>
                <p className="text-sm">Browse through our exciting hackathon opportunities</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  Filter Hackathons
                </h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <FilterGroup
                  title="User"
                  options={users}
                  selected={filters.user}
                  onChange={(v) => toggleFilter("user", v)}
                />
                <FilterGroup
                  title="Category"
                  options={categories}
                  selected={filters.category}
                  onChange={(v) => toggleFilter("category", v)}
                />
                <FilterGroup
                  title="Payment"
                  options={payments}
                  selected={filters.payment}
                  onChange={(v) => toggleFilter("payment", v)}
                />
                <FilterGroup
                  title="Event Type"
                  options={eventTypes}
                  selected={filters.eventType}
                  onChange={(v) => toggleFilter("eventType", v)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}