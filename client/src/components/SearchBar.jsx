
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ query, setQuery }) => {
  return (
    <div className="relative w-full max-w-md mx-auto mb-4">
      <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search here..."
        className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
      />
    </div>
  );
};

export default SearchBar;
