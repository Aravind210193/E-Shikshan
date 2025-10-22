import React, { useState, useEffect } from 'react'
import Contentcard from '../components/Contentcard'
import educationLevelsData from '../data/educationLevels.json'
import { motion } from 'framer-motion'
import { Search, BookOpen, TrendingUp, Star, BookOpen as Book, School, GraduationCap } from 'lucide-react'

const Content = () => {
  const [query, setQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('UG'); // Default to UG
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [theme, setTheme] = useState({});

  // Define themes for each education level
  const themes = {
    '10th': {
      heroGradient: 'from-sky-500 to-cyan-500',
      selectedButton: 'bg-sky-600',
      accentColor: 'text-sky-400',
      secondaryAccent: 'text-cyan-300',
      tagBg: 'bg-sky-900 bg-opacity-50',
      tagText: 'text-sky-200',
    },
    'Intermediate': {
      heroGradient: 'from-teal-500 to-emerald-500',
      selectedButton: 'bg-teal-600',
      accentColor: 'text-teal-400',
      secondaryAccent: 'text-emerald-300',
      tagBg: 'bg-teal-900 bg-opacity-50',
      tagText: 'text-teal-200',
    },
    'UG': {
      heroGradient: 'from-violet-500 to-purple-500',
      selectedButton: 'bg-violet-600',
      accentColor: 'text-violet-400',
      secondaryAccent: 'text-purple-300',
      tagBg: 'bg-violet-900 bg-opacity-50',
      tagText: 'text-violet-200',
    },
    'PG': {
      heroGradient: 'from-indigo-500 to-blue-500',
      selectedButton: 'bg-indigo-600',
      accentColor: 'text-indigo-400',
      secondaryAccent: 'text-blue-300',
      tagBg: 'bg-indigo-900 bg-opacity-50',
      tagText: 'text-indigo-200',
    }
  };

  // Get current education level data
  const getCurrentLevelData = () => {
    return educationLevelsData.find(level => level.level === selectedLevel) || { branches: [] };
  };
  
  // Update filtered branches and theme when level changes or when searching
  useEffect(() => {
    const currentLevelData = getCurrentLevelData();
    const filtered = currentLevelData.branches.filter(branch => 
      branch.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBranches(filtered);
    setTheme(themes[selectedLevel] || themes['UG']);
  }, [query, selectedLevel]);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Helper function to get the appropriate icon for each education level
  const getLevelIcon = (level) => {
    switch(level) {
      case '10th':
        return <Book className="h-5 w-5" />;
      case 'Intermediate':
        return <School className="h-5 w-5" />;
      case 'UG':
        return <GraduationCap className="h-5 w-5" />;
      case 'PG':
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800'>
      {/* Hero Section */}
      <motion.div 
        className={`relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${theme.heroGradient} rounded-b-3xl shadow-2xl`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className='max-w-7xl mx-auto'>
          <motion.div 
            className='text-center'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight'>
              <span className='block'>Explore Academic</span>
              <span className={`block ${theme.secondaryAccent}`}>Branches & Courses</span>
            </h1>
            <p className='max-w-xl mx-auto text-xl text-blue-100 mb-10'>
              Choose from our comprehensive selection of academic disciplines and start your learning journey today.
            </p>
            
            {/* Search Bar */}
            <div className='max-w-md mx-auto relative'>
              <div className={`flex items-center backdrop-blur-lg rounded-full p-1 pl-6 shadow-lg ${
                selectedLevel === '10th' 
                  ? 'bg-cyan-400/30 border-2 border-cyan-300/50' 
                  : selectedLevel === 'Intermediate'
                  ? 'bg-emerald-500/30 border-2 border-emerald-300/50'
                  : selectedLevel === 'UG'
                  ? 'bg-amber-500/30 border-2 border-amber-300/50'
                  : 'bg-rose-600/30 border-2 border-rose-400/50'
              }`}>
                <Search className={`h-5 w-5 mr-2 ${
                  selectedLevel === '10th' 
                    ? 'text-cyan-100' 
                    : selectedLevel === 'Intermediate'
                    ? 'text-emerald-100'
                    : selectedLevel === 'UG'
                    ? 'text-amber-100'
                    : 'text-rose-100'
                }`} />
                <input 
                  type='text' 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${selectedLevel} branches...`}
                  className={`bg-transparent border-none outline-none w-full py-2 ${
                    selectedLevel === '10th' 
                      ? 'text-cyan-50 placeholder-cyan-200' 
                      : selectedLevel === 'Intermediate'
                      ? 'text-emerald-50 placeholder-emerald-200'
                      : selectedLevel === 'UG'
                      ? 'text-amber-50 placeholder-amber-200'
                      : 'text-rose-50 placeholder-rose-200'
                  }`}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className={`${theme.selectedButton} hover:bg-opacity-80 text-white rounded-full px-5 py-2 font-medium shadow-md`}
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className='hidden md:block absolute bottom-0 left-0 -mb-6 ml-6'>
          <div className='flex space-x-2'>
            <div className='w-4 h-4 bg-cyan-400 rounded-full'></div>
            <div className='w-4 h-4 bg-emerald-400 rounded-full'></div>
            <div className='w-4 h-4 bg-amber-400 rounded-full'></div>
          </div>
        </div>
      </motion.div>
      
      {/* Education Level Selector */}
      <div className="bg-gray-800 py-6 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {educationLevelsData.map((eduLevel) => (
              <motion.div
                key={eduLevel.level}
                onClick={() => setSelectedLevel(eduLevel.level)}
                className={`px-8 py-4 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                  selectedLevel === eduLevel.level 
                    ? `${theme.selectedButton} shadow-lg scale-105` 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                whileHover={{ scale: selectedLevel === eduLevel.level ? 1.05 : 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`${selectedLevel === eduLevel.level ? 'text-white' : 'text-gray-300'}`}>
                  {getLevelIcon(eduLevel.level)}
                </div>
                <span className={`text-lg font-medium ${selectedLevel === eduLevel.level ? 'text-white' : 'text-gray-300'}`}>
                  {eduLevel.level}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <motion.div 
          className='flex flex-col md:flex-row justify-between items-center mb-10'
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className='flex items-center mb-4 md:mb-0'>
            <BookOpen className={`w-8 h-8 ${theme.accentColor} mr-2`} />
            <h2 className={`text-3xl font-bold ${
              selectedLevel === '10th' 
                ? 'text-cyan-100' 
                : selectedLevel === 'Intermediate'
                ? 'text-emerald-100'
                : selectedLevel === 'UG'
                ? 'text-amber-100'
                : 'text-rose-100'
            }`}>{selectedLevel} Branches</h2>
          </div>
          
          <div className='flex space-x-4'>
            <button className={`px-4 py-2 rounded-full flex items-center font-medium transition-all duration-300 ${
              selectedLevel === '10th' 
                ? 'bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-100 border border-cyan-500/40' 
                : selectedLevel === 'Intermediate'
                ? 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-100 border border-emerald-500/40'
                : selectedLevel === 'UG'
                ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-100 border border-amber-500/40'
                : 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-100 border border-rose-500/40'
            }`}>
              <TrendingUp className='w-4 h-4 mr-2' />
              Popular
            </button>
            <button className={`px-4 py-2 rounded-full flex items-center font-medium transition-all duration-300 ${
              selectedLevel === '10th' 
                ? 'bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-100 border border-cyan-500/40' 
                : selectedLevel === 'Intermediate'
                ? 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-100 border border-emerald-500/40'
                : selectedLevel === 'UG'
                ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-100 border border-amber-500/40'
                : 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-100 border border-rose-500/40'
            }`}>
              <Star className='w-4 h-4 mr-2' />
              Recommended
            </button>
          </div>
        </motion.div>
        
        {/* Education Level Description */}
        <motion.div
          className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h3 className={`text-xl ${theme.secondaryAccent} mb-2`}>About {selectedLevel} Education</h3>
          <p className="text-gray-300 mb-4">
            {selectedLevel === '10th' && "10th grade education focuses on fundamental concepts across core subjects, preparing students for higher education choices."}
            {selectedLevel === 'Intermediate' && "Intermediate education (11th & 12th) allows students to specialize in streams like Science, Commerce, or Arts before entering undergraduate programs."}
            {selectedLevel === 'UG' && "Undergraduate programs provide specialized knowledge in various engineering and professional fields, typically spanning 3-4 years of study."}
            {selectedLevel === 'PG' && "Postgraduate studies offer advanced specialization and research opportunities for students who have completed their undergraduate education."}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className={`${theme.tagBg} ${theme.tagText} px-3 py-1 rounded-full text-sm`}>
              {selectedLevel === '10th' && "Class X"}
              {selectedLevel === 'Intermediate' && "Class XI & XII"}
              {selectedLevel === 'UG' && "Bachelor's Degree"}
              {selectedLevel === 'PG' && "Master's Degree"}
            </span>
            <span className={`bg-purple-900 bg-opacity-50 text-purple-200 px-3 py-1 rounded-full text-sm`}>
              {selectedLevel === '10th' && "Board Exams"}
              {selectedLevel === 'Intermediate' && "College Preparation"}
              {selectedLevel === 'UG' && "Professional Studies"}
              {selectedLevel === 'PG' && "Advanced Specialization"}
            </span>
          </div>
        </motion.div>
        
        {/* Branches Grid */}
        <motion.div 
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'
          variants={staggerContainer}
          key={selectedLevel} // Force re-render of animation when level changes
          initial="hidden"
          animate="visible"
        >
          {  
            filteredBranches.length > 0 ? (
              filteredBranches.map((branch, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Contentcard 
                    title={branch.title}
                    link={branch.link}
                    theme={theme}
                    educationLevel={selectedLevel}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={fadeInUp}
                className={`col-span-full text-center py-10 rounded-xl ${
                  selectedLevel === '10th' 
                    ? 'bg-cyan-900/20 border border-cyan-600/30' 
                    : selectedLevel === 'Intermediate'
                    ? 'bg-emerald-900/20 border border-emerald-600/30'
                    : selectedLevel === 'UG'
                    ? 'bg-amber-900/20 border border-amber-600/30'
                    : 'bg-rose-800/50 border border-rose-600/30'
                }`}
              >
                <div className={`text-6xl mb-4 ${
                  selectedLevel === '10th' 
                    ? 'text-cyan-400' 
                    : selectedLevel === 'Intermediate'
                    ? 'text-emerald-400'
                    : selectedLevel === 'UG'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  🔍
                </div>
                <p className={`text-xl font-medium mb-2 ${
                  selectedLevel === '10th' 
                    ? 'text-cyan-100' 
                    : selectedLevel === 'Intermediate'
                    ? 'text-emerald-100'
                    : selectedLevel === 'UG'
                    ? 'text-amber-100'
                    : 'text-rose-100'
                }`}>
                  {query ? `No branches found matching "${query}"` : `No branches available for ${selectedLevel}`}
                </p>
                <p className={`${
                  selectedLevel === '10th' 
                    ? 'text-cyan-300' 
                    : selectedLevel === 'Intermediate'
                    ? 'text-emerald-300'
                    : selectedLevel === 'UG'
                    ? 'text-amber-300'
                    : 'text-rose-300'
                }`}>
                  Try adjusting your search or explore other education levels
                </p>
              </motion.div>
            )
          }
        </motion.div>
        
        {/* Featured Courses Section */}
        <motion.div
          className="mt-16 mb-12"
          key={`featured-${selectedLevel}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            Featured {selectedLevel} Courses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              // Dynamic course data based on selected education level
              const coursesByLevel = {
                '10th': [
                  {
                    title: "10th Mathematics Complete Course",
                    description: "Master all mathematical concepts for your board exams",
                    image: "/public/learn.png",
                    students: "8,320",
                    rating: 4.9
                  },
                  {
                    title: "Science Made Easy for Class 10",
                    description: "Simplified approach to Physics, Chemistry and Biology",
                    image: "/public/images.png",
                    students: "7,150",
                    rating: 4.8
                  },
                  {
                    title: "Social Studies Crash Course",
                    description: "Quick review of History, Geography, Civics and Economics",
                    image: "/public/digital.png",
                    students: "5,640",
                    rating: 4.7
                  }
                ],
                'Intermediate': [
                  {
                    title: "JEE Mathematics Preparation",
                    description: "Comprehensive preparation for competitive exams",
                    image: "/public/images.png",
                    students: "12,480",
                    rating: 4.8
                  },
                  {
                    title: "Intermediate Physics",
                    description: "Advanced concepts with practical applications",
                    image: "/public/digital.png",
                    students: "9,730",
                    rating: 4.7
                  },
                  {
                    title: "Organic Chemistry Masterclass",
                    description: "Detailed coverage of reactions and mechanisms",
                    image: "/public/learn.png",
                    students: "8,250",
                    rating: 4.9
                  }
                ],
                'UG': [
                  {
                    title: "Introduction to Computer Science",
                    description: "Learn the fundamentals of programming and computer science concepts",
                    image: "/public/images.png",
                    students: "5,240",
                    rating: 4.8
                  },
                  {
                    title: "Advanced Electronics",
                    description: "Master circuit design and electronic systems development",
                    image: "/public/digital.png",
                    students: "3,890",
                    rating: 4.7
                  },
                  {
                    title: "Structural Engineering Basics",
                    description: "Understand the principles of designing strong and durable structures",
                    image: "/public/learn.png",
                    students: "2,150",
                    rating: 4.6
                  }
                ],
                'PG': [
                  {
                    title: "Advanced Machine Learning",
                    description: "Cutting-edge algorithms and techniques in AI",
                    image: "/public/digital.png",
                    students: "4,120",
                    rating: 4.9
                  },
                  {
                    title: "Business Analytics for Managers",
                    description: "Data-driven decision making for business professionals",
                    image: "/public/images.png",
                    students: "3,580",
                    rating: 4.8
                  },
                  {
                    title: "Research Methodology",
                    description: "Essential techniques for academic and industry research",
                    image: "/public/learn.png",
                    students: "2,950",
                    rating: 4.7
                  }
                ]
              };
              
              return coursesByLevel[selectedLevel].map((course, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-40 bg-gray-700 relative overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs py-1 px-2 rounded-full">
                      Popular
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex items-center text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} fill={i < Math.floor(course.rating) ? "currentColor" : "none"} className="w-4 h-4" />
                          ))}
                        </div>
                        <span className="text-white">{course.rating}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{course.students} students</span>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-700 flex justify-between items-center">
                    <span className="text-blue-300 font-medium">Free</span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Enroll Now
                    </button>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </motion.div>
        
        {/* Trending Topics Section */}
        <motion.div
          className="mt-16 pb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <TrendingUp className="w-8 h-8 text-green-400 mr-2" />
            Trending Topics for {selectedLevel}
          </h2>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {(() => {
              // Dynamic trending topics based on selected education level
              const topicsByLevel = {
                '10th': [
                  "Mathematics", "Physics", "Chemistry", "Biology", 
                  "History", "Geography", "English Grammar", "Algebra",
                  "Geometry", "Science Projects", "Board Exam Prep", "Quiz Competitions"
                ],
                'Intermediate': [
                  "Physics", "Chemistry", "Mathematics", "Biology", 
                  "JEE Preparation", "NEET Preparation", "Economics", "Accounts",
                  "Computer Science", "Physical Education", "English", "Statistics"
                ],
                'UG': [
                  "Machine Learning", "Web Development", "Data Structures", 
                  "Artificial Intelligence", "Quantum Computing", "Robotics",
                  "Mobile App Development", "Cyber Security", "Cloud Computing", 
                  "IoT", "Blockchain", "Game Development"
                ],
                'PG': [
                  "Data Science", "AI Research", "Advanced Algorithms", 
                  "Financial Analysis", "Business Strategy", "Cloud Architecture",
                  "Research Publishing", "Industry Projects", "System Design", 
                  "Thesis Writing", "Specialized Research", "Domain Expertise"
                ]
              };
              
              return topicsByLevel[selectedLevel].map((topic, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-full cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "#374151" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-gray-200">{topic}</span>
                </motion.div>
              ));
            })()}
          </div>
        </motion.div>
        
        {/* Stats Section */}
        <motion.div
          className="mt-10 py-12 bg-gray-800 rounded-2xl shadow-inner px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {(() => {
              // Dynamic stats based on selected education level
              const statsByLevel = {
                '10th': [
                  { label: "Active Students", value: "25,000+", color: "text-blue-400" },
                  { label: "Practice Questions", value: "50,000+", color: "text-green-400" },
                  { label: "Expert Teachers", value: "120+", color: "text-purple-400" },
                  { label: "Success Rate", value: "92%", color: "text-yellow-400" }
                ],
                'Intermediate': [
                  { label: "Active Students", value: "18,000+", color: "text-blue-400" },
                  { label: "Practice Tests", value: "3,000+", color: "text-green-400" },
                  { label: "Subject Experts", value: "150+", color: "text-purple-400" },
                  { label: "Selection Rate", value: "85%", color: "text-yellow-400" }
                ],
                'UG': [
                  { label: "Active Learners", value: "15,000+", color: "text-blue-400" },
                  { label: "Completed Courses", value: "24,000+", color: "text-green-400" },
                  { label: "Expert Instructors", value: "200+", color: "text-purple-400" },
                  { label: "Satisfaction Rate", value: "98%", color: "text-yellow-400" }
                ],
                'PG': [
                  { label: "Research Students", value: "8,500+", color: "text-blue-400" },
                  { label: "Published Papers", value: "1,200+", color: "text-green-400" },
                  { label: "Industry Partners", value: "75+", color: "text-purple-400" },
                  { label: "Placement Rate", value: "94%", color: "text-yellow-400" }
                ]
              };
              
              return statsByLevel[selectedLevel].map((stat, index) => (
                <div key={index} className="p-4">
                  <h3 className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</h3>
                  <p className="text-gray-400 text-lg">{stat.label}</p>
                </div>
              ));
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Content
