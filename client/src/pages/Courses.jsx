// import React, { useState } from 'react';
// import SearchBar from '../components/SearchBar';
// import CourseCard from '../components/CourseCard';
// import CourseDetail from '../components/CourseDetail';
// import courseData from '../data/courseData';

// const Course = () => {
//   const [query, setQuery] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState(null);

//   const filtered = courseData.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

//   return (
//     <div className="p-6">
//       {selectedCourse ? (
//         <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
//       ) : (
//         <>
//           <h1 className="text-xl font-bold mb-4">Enroll in Courses</h1>
//           <SearchBar query={query} setQuery={setQuery} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {(query ? filtered : courseData.slice(0, 4)).map(course => (
//               <CourseCard key={course.id} course={course} onSelect={setSelectedCourse} />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Course;
import React from 'react'

const Courses = () => {
  return (
    <div>Courses</div>
  )
}

export default Courses