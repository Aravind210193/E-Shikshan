import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Contentcard from '../components/Contentcard';
import ContentDetail from '../components/ContentDetail';
import contentData from '../data/contentData';

const Content = () => {
  const [query, setQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  const filtered = contentData.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6">
      {selectedContent ? (
        <ContentDetail content={selectedContent} onBack={() => setSelectedContent(null)} />
      ) : (
        <>
          <h1 className="text-xl font-bold mb-4">Content Library</h1>
          <SearchBar query={query} setQuery={setQuery} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(query ? filtered : contentData.slice(0, 4)).map(content => (
              <Contentcard key={content.id} content={content} onSelect={setSelectedContent} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Content;