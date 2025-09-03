import { useState } from "react";
import { Link } from "react-router-dom";
import { FunnelIcon } from "@heroicons/react/24/solid";
import jobData from "../data/jobProfile.json";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import { XIcon } from "lucide-react";
export default function JobRole() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [query, setQuery] = useState("");

  const toggleFilter = () => setShowFilter(prev => !prev);

  // Unique categories
  const categories = [...new Set(jobData.map(job => job.category))];

  // Checkbox logic
  const handleCheckboxChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Final combined filter logic
  const displayedJobs = jobData.filter(job => {
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

  const applyFilters = () => {
    setShowFilter(false);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen relative">
      <div className="flex justify-center ">
      {/* Search Input */}
      <div className="w-100">
      <SearchBar  query={query} setQuery={setQuery} />
      </div>
      {/* Filter Button */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2  text-white px-4 py-2 rounded-full hover:bg-gray-700"
        >
          <FunnelIcon className="h-5 w-5 cursor-pointer" />
        
        </button>
      </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="absolute top-5 right-30 bg-gray-300 p-6 rounded-lg shadow-lg z-50 w-72">
          <div className="flex justify-between ">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Category</h2>
          <XIcon onClick={toggleFilter} className="w-6 h-5 cursor-pointer rounded  bg-red-700 "/>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
            {categories.map(category => (
              <label key={category} className="flex items-center gap-2 text-gray-800 capitalize">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCheckboxChange(category)}
                  className="accent-blue-600"
                />
                {category.replace("-", " ")}
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={applyFilters}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="text-gray-700 hover:underline"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedJobs.length > 0 ? (
          displayedJobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`}>
              <JobCard job={job} />
            </Link>
          ))
        ) : (
          <div className="text-white col-span-full text-center mt-10">
            No jobs found.
          </div>
        )}
      </div>
    </div>
  );
}
