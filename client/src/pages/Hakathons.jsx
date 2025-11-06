import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, X, Calendar, Trophy, Tag, Flag, Users, Search } from "lucide-react";
import { hackathonsAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

// ...existing code...
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.3);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #ec4899, #8b5cf6);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #f472b6, #a78bfa);
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #ec4899 #1f2937;
  }
`;

// ...existing code...
const addScrollbarStyles = () => {
  const style = document.createElement('style');
  style.textContent = scrollbarStyles;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
};

// ...existing code...
const FilterGroup = ({ title, options, selected, onChange }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-700/40 rounded-2xl p-5 backdrop-blur-sm border border-purple-500/20 shadow-lg"
    >
      <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option, index) => (
          <motion.label
            key={option}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.02, x: 2 }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 transition-all cursor-pointer group border border-transparent hover:border-purple-500/30"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              className="w-4 h-4 rounded border-gray-500 text-purple-500 focus:ring-purple-600 focus:ring-offset-gray-800 bg-gray-700/50 transition-all"
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
              {option}
            </span>
          </motion.label>
        ))}
      </div>
    </motion.div>
  );
};

// ...existing code...
const HackathonCard = ({ hackathon, isSelected, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
      isSelected ? "ring-2 ring-pink-500 shadow-pink-500/20" : "hover:ring-2 hover:ring-purple-500"
    }`}
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={hackathon.imageUrl || hackathon.image}
        alt={hackathon.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      {/* Status badge */}
      <div className="absolute top-3 left-3">
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-md ${
            (hackathon.status || "").toLowerCase() === "live"
              ? "bg-green-500/90 text-white"
              : (hackathon.status || "").toLowerCase() === "upcoming"
              ? "bg-yellow-500/90 text-black"
              : "bg-gray-600/90 text-white"
          }`}
        >
          {hackathon.status}
        </span>
      </div>
      {/* Event type and payment chips */}
      <div className="absolute top-3 right-3 flex gap-2">
        {(hackathon.mode || hackathon.EventType) && (
          <span className="px-2 py-1 text-[10px] uppercase tracking-wide rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20">
            {String(hackathon.mode || hackathon.EventType).toUpperCase()}
          </span>
        )}
        {hackathon.payment && (
          <span
            className={`px-2 py-1 text-[10px] uppercase tracking-wide rounded-full border ${
              String(hackathon.payment).toLowerCase() === "free"
                ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                : "bg-rose-500/20 text-rose-200 border-rose-400/40"
            }`}
          >
            {hackathon.payment}
          </span>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-xl font-bold text-white mb-1 truncate">{hackathon.title}</h3>
        <p className="text-sm text-gray-300 truncate">{hackathon.tagline}</p>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {(hackathon.teamSize || hackathon.TeamSize) && (
            <span className="text-[11px] text-gray-200/90 bg-black/30 border border-white/10 px-2 py-0.5 rounded-full">
              Team {hackathon.teamSize || hackathon.TeamSize}
            </span>
          )}
          {hackathon.category && (
            <span className="text-[11px] text-gray-200/90 bg-black/30 border border-white/10 px-2 py-0.5 rounded-full">
              {hackathon.category}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="p-4 bg-gray-800/90 backdrop-blur-sm space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <Calendar className="w-4 h-4 text-pink-400" />
        <span>{hackathon.startDate} - {hackathon.endDate}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <Trophy className="w-4 h-4 text-purple-400" />
        <span>{hackathon.prize}</span>
      </div>
    </div>
  </motion.div>
);

export default function Hakathons() {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    user: [],
    category: [],
    payment: [],
    eventType: [],
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ...existing code...
  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const { data } = await hackathonsAPI.getAll({ sort: sortBy });
        const items = (data?.hackathons || []).map((h) => ({
          ...h,
          id: h._id,
          image: h.imageUrl || h.image || "",
          bgimage: h.bgImage || h.bgimage || h.imageUrl || "",
          EventType: h.mode ? String(h.mode).toUpperCase() : undefined,
          TeamSize: h.teamSize,
          category: (h.tags && h.tags[0]) || h.organizer || "",
        }));
        if (!ignore) {
          setHackathons(items);
          setSelectedHackathon(items[0] || null);
        }
      } catch (e) {
        console.error(e);
        if (!ignore) setError(e?.response?.data?.message || 'Failed to load hackathons');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [sortBy]);

  // ...existing code...
  const users = [...new Set(hackathons.map((h) => h.user).filter(Boolean))];
  const categories = [...new Set(hackathons.map((h) => h.category).filter(Boolean))];
  const payments = [...new Set(hackathons.map((h) => h.payment).filter(Boolean))];
  const eventTypes = [...new Set(hackathons.map((h) => h.EventType).filter(Boolean))];

  // ...existing code...
  useEffect(() => {
    return addScrollbarStyles();
  }, []);

  // ...existing code...
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

  // ...existing code...
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

  // ...existing code...
  const clearFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
  };

  // ...existing code...
  const filteredHackathons = hackathons.filter((h) => {
    const userMatch = filters.user.length === 0 || filters.user.includes(h.user);
    const categoryMatch = filters.category.length === 0 || filters.category.includes(h.category);
    const paymentMatch = filters.payment.length === 0 || filters.payment.includes(h.payment);
    const eventTypeMatch = filters.eventType.length === 0 || filters.eventType.includes(h.EventType);
    const searchMatch = searchTerm === "" || h.title.toLowerCase().includes(searchTerm.toLowerCase()) || h.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const now = new Date();
    const end = h.endDate ? new Date(h.endDate) : null;
    let statusMatch = true;
    if (statusFilter === "live") statusMatch = String(h.status || "").toLowerCase() === "live";
    else if (statusFilter === "upcoming") statusMatch = String(h.status || "").toLowerCase() === "upcoming";
    else if (statusFilter === "past") statusMatch = end ? end < now : false;
    return userMatch && categoryMatch && paymentMatch && eventTypeMatch && searchMatch && statusMatch;
  });

  // ...existing code...
  const sortedHackathons = [...filteredHackathons].sort((a, b) => {
    const toDate = (d) => (d ? new Date(d) : new Date(0));
    const prizeNum = (p) => {
      if (!p) return 0;
      const n = parseInt(String(p).replace(/[^0-9]/g, ""), 10);
      return Number.isNaN(n) ? 0 : n;
    };
    switch (sortBy) {
      case "ending-soon":
        return toDate(a.endDate) - toDate(b.endDate);
      case "prize":
        return prizeNum(b.prize) - prizeNum(a.prize);
      case "live": {
        const aLive = String(a.status || "").toLowerCase() === "live" ? 1 : 0;
        const bLive = String(b.status || "").toLowerCase() === "live" ? 1 : 0;
        return bLive - aLive || toDate(b.startDate) - toDate(a.startDate);
      }
      case "free": {
        const aFree = String(a.payment || "").toLowerCase() === "free" ? 1 : 0;
        const bFree = String(b.payment || "").toLowerCase() === "free" ? 1 : 0;
        return bFree - aFree || toDate(b.startDate) - toDate(a.startDate);
      }
      case "newest":
      default:
        return toDate(b.startDate) - toDate(a.startDate);
    }
  });

  // ...existing code...
  const totalCount = hackathons.length;
  const liveCount = hackathons.filter((h) => {
    const s = String(h.status || "").toLowerCase();
    return s === "live" || s === "active";
  }).length;
  const upcomingCount = hackathons.filter((h) => String(h.status || "").toLowerCase() === "upcoming").length;
  const pastCount = hackathons.filter((h) => (h.endDate ? new Date(h.endDate) < new Date() : false)).length;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* Header and Filter Bar */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-pink-500/20 px-4 sm:px-6 py-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-8xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Hackathon Hub
            </h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hackathons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                />
              </div>
              {/* Sort selector */}
              <div className="flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="ending-soon">Ending Soon</option>
                  <option value="prize">Top Prize</option>
                  <option value="live">Live Now</option>
                  <option value="free">Free First</option>
                </select>
              </div>
              {/* Status selector */}
              <div className="flex-shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="live">Live</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-3 sm:px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex-shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm">Filters</span>
              </button>
            </div>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
            {[{label: 'Total', value: totalCount}, {label: 'Live', value: liveCount}, {label: 'Upcoming', value: upcomingCount}, {label: 'Past', value: pastCount}].map((s, i) => (
              <div key={i} className="text-center bg-gray-800/40 border border-gray-700/60 rounded-lg py-2 px-1">
                <div className="text-xs text-gray-400">{s.label}</div>
                <div className="text-base sm:text-lg font-semibold text-white">{s.value}</div>
              </div>
            ))}
          </div>
          <AnimatePresence>
            <div className="flex gap-2 flex-wrap mt-4">
              {Object.entries(filters).map(([key, values]) =>
                values.map((value) => (
                  <motion.span
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={`${key}-${value}`}
                    className="bg-gradient-to-r from-pink-600/50 to-purple-700/50 border border-pink-500/30 px-3 py-1 rounded-full text-sm cursor-pointer flex items-center gap-2 hover:from-pink-700/60 hover:to-purple-800/60 transition-all duration-300 shadow-md"
                    onClick={() => clearFilter(key, value)}
                  >
                    {value} <X size={14} />
                  </motion.span>
                ))
              )}
            </div>
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content with Independent Scrolling */}
  <main className="flex flex-col lg:flex-row flex-1 overflow-x-hidden lg:overflow-hidden w-full">
        {/* Left Panel: Hackathon Cards */}
  <aside className="w-full lg:w-1/3 xl:w-1/4 bg-black/20 lg:h-[calc(100vh-112px)] flex flex-col border-b lg:border-b-0 lg:border-r border-pink-500/20 shadow-lg">
          <div className="p-2 sm:p-4 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                {loading ? (
                  <div className="col-span-full text-center text-gray-400 py-10">Loading hackathons...</div>
                ) : error ? (
                  <div className="col-span-full text-center text-rose-400 py-10">{String(error)}</div>
                ) : sortedHackathons.length > 0 ? (
                  sortedHackathons.map((hackathon) => (
                    <HackathonCard
                      key={hackathon._id}
                      hackathon={hackathon}
                      isSelected={selectedHackathon?._id === hackathon._id}
                      onClick={() => setSelectedHackathon(hackathon)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full flex flex-col items-center justify-center p-8 text-gray-400 text-center"
                  >
                    <Flag className="w-12 h-12 mb-4 text-pink-500" />
                    <p className="text-lg font-semibold">No hackathons found</p>
                    <p className="text-sm">Try clearing some filters or adjusting your search.</p>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </div>
        </aside>

        {/* Right Panel: Selected Hackathon Details */}
  <section className="flex-1 bg-black/10 lg:h-[calc(100vh-112px)] overflow-x-hidden">
          <div className="h-full p-3 sm:p-4 lg:p-8 overflow-y-auto custom-scrollbar w-full">
            <AnimatePresence mode="wait">
              {selectedHackathon ? (
                <motion.div
                  key={selectedHackathon._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Banner */}
                  <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-black/50">
                    <img
                      src={selectedHackathon.bgImage || selectedHackathon.bgimage}
                      alt={selectedHackathon.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <motion.h1
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-3xl sm:text-5xl font-extrabold text-white mb-2"
                        >
                          {selectedHackathon.title}
                        </motion.h1>
                        <motion.p
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-lg text-gray-200"
                        >
                          {selectedHackathon.tagline}
                        </motion.p>
                      </div>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { icon: Calendar, label: "Duration", value: `${new Date(selectedHackathon.startDate).toLocaleDateString()} - ${new Date(selectedHackathon.endDate).toLocaleDateString()}` },
                      { icon: Flag, label: "Status", value: selectedHackathon.status },
                      { icon: Tag, label: "Category", value: selectedHackathon.organizer || selectedHackathon.category },
                      { icon: Trophy, label: "Prize Pool", value: selectedHackathon.prize },
                      { icon: Tag, label: "Event Type", value: selectedHackathon.mode || selectedHackathon.EventType },
                      { icon: Users, label: "Team Size", value: selectedHackathon.teamSize || selectedHackathon.TeamSize },
                      { icon: Tag, label: "Payment", value: selectedHackathon.payment }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50"
                      >
                        <item.icon className="w-7 h-7 text-pink-400 mb-3" />
                        <p className="text-sm text-gray-400">{item.label}</p>
                        <p className="text-base font-semibold text-white">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800/30 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-gray-700/50"
                  >
                    <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                      Overview
                    </h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {selectedHackathon.overview}
                    </p>
                  </motion.div>

                  {/* Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-gray-800/30 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-gray-700/50"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                      Timeline
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Registration Closes', value: selectedHackathon.registrationCloses },
                        { label: 'Starts', value: selectedHackathon.startDate },
                        { label: 'Submission Deadline', value: selectedHackathon.submissionDeadline },
                        { label: 'Ends', value: selectedHackathon.endDate },
                      ].map((step, i) => (
                        <div key={i} className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4">
                          <div className="text-sm text-gray-400">{step.label}</div>
                          <div className="text-white font-semibold text-lg">{step.value || '-'}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* View More Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to={`/hackathon/${selectedHackathon._id}`}
                      className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-10 py-4 rounded-lg font-semibold text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20"
                    >
                      View Full Details & Register
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="no-selection"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center"
                >
                  <Users className="w-20 h-20 mb-6 text-gray-600" />
                  <p className="text-2xl font-semibold">Select a hackathon</p>
                  <p className="text-base mt-2">Choose a hackathon from the list to see its details.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-4 sm:p-8 border border-purple-500/20 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with decorative elements */}
              <div className="flex justify-between items-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-700/50">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-2 sm:gap-3">
                    <span className="p-2 bg-purple-500/20 rounded-lg">
                      <SlidersHorizontal className="w-6 h-6 text-purple-400" />
                    </span>
                    Filter Hackathons
                  </h2>
                  <p className="text-sm text-gray-400 ml-14">Refine your search</p>
                </div>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-xl hover:bg-gray-700/50 hover:rotate-90 transform"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
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

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700/50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFilters({ user: [], category: [], payment: [], eventType: [] });
                    setShowFilterModal(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300 font-medium border border-gray-600/50 hover:border-gray-500"
                >
                  Clear All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilterModal(false)}
                  className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-300 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}