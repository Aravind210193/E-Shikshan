import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import skills from '../Roadmap/skills.json'
import RoadmapCard from '../components/RoadmapCard';

const Roadmap = () => {
  const [selectedContent,setSelectedContent] = useState(null);
  const [query, setQuery] = useState("");
  const filtered = skills.filter((skill)=>skill.name.toLowerCase().includes(query.toLowerCase()));


  return (
    <div className="flex flex-row h-screen justify-around  overflow-hidden">
          <div>
          <h1 className="text-xl font-bold mb-4 ">Roadmaps </h1>
          <div className='flex flex-row gap-3'>       
            {(query ? filtered : skills.slice(0, 4)).map(skill => (
              <RoadmapCard key={skill.name} skill={skill} onSelect={setSelectedContent} />
            ))}
        </div>
        </div>
            <div >
                <SearchBar  query={query} setQuery={setQuery} />
            </div>
        
    </div> 

  );
};

export default Roadmap;