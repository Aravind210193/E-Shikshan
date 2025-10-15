import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Users, Bookmark, ArrowRight, Play, Star, Clock, Award } from 'lucide-react'

const Contentcard = ({title, link, theme, educationLevel}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    // Handle navigation based on education level
    const handleNavigation = () => {
      if (educationLevel === '10th') {
        // Navigate to 10th grade term selection
        navigate('/content/10th');
      } else if (educationLevel === 'Intermediate') {
        // Navigate to intermediate stream selection
        navigate('/content/intermediate');
      } else if (educationLevel === 'PG') {
        // Navigate to postgraduate program selection
        navigate('/content/postgraduate');
      } else {
        // For UG and other levels, use the existing navigation
        navigate(`/content/${title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`);
      }
    };
    
    // Different card designs based on education level
    const getCardDesign = () => {
      switch(educationLevel) {
        case '10th':
          return {
            containerClass: 'bg-gradient-to-br from-green-500/30 to-teal-500/30 border-2 border-green-400/30 rounded-2xl',
            iconStyle: 'bg-green-500 text-white p-3 rounded-full shadow-lg',
            titleStyle: 'text-2xl font-bold text-green-100 mb-3',
            layout: 'simple'
          };
        case 'Intermediate':
          return {
            containerClass: 'bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border border-blue-300/20 rounded-xl transform',
            iconStyle: 'bg-blue-600 text-white p-4 rounded-lg shadow-xl',
            titleStyle: 'text-xl font-semibold text-blue-50 mb-4',
            layout: 'modern'
          };
        case 'UG':
          return {
            containerClass: 'bg-gradient-to-br from-purple-600/25 via-violet-500/25 to-indigo-500/25 backdrop-blur-lg border border-purple-300/20 rounded-2xl',
            iconStyle: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white p-3 rounded-xl shadow-lg',
            titleStyle: 'text-lg font-bold text-purple-100 mb-2',
            layout: 'glass'
          };
        case 'PG':
          return {
            containerClass: 'bg-gradient-to-bl from-gray-800/90 to-gray-900/90 border border-gray-600/30 rounded-lg shadow-2xl',
            iconStyle: 'bg-gray-700 text-gray-200 p-4 rounded-md border border-gray-500',
            titleStyle: 'text-xl font-medium text-gray-100 mb-3',
            layout: 'professional'
          };
        default:
          return {
            containerClass: 'bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20',
            iconStyle: 'bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl',
            titleStyle: 'text-xl font-bold text-white mb-4',
            layout: 'default'
          };
      }
    };
    
    // Get random stats for visual interest
    const getRandomStats = () => {
      return {
        students: Math.floor(Math.random() * 50) + 10,
        courses: Math.floor(Math.random() * 20) + 5,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        duration: Math.floor(Math.random() * 8) + 4
      };
    };
    
    const stats = getRandomStats();
    
    // Get subject-specific icon
    const getSubjectIcon = () => {
      const iconMap = {
        'computer': <BookOpen className="h-6 w-6" />,
        'science': <Award className="h-6 w-6" />,
        'math': <BookOpen className="h-6 w-6" />,
        'engine': <BookOpen className="h-6 w-6" />,
        'electric': <BookOpen className="h-6 w-6" />,
        'law': <BookOpen className="h-6 w-6" />,
        'medicine': <BookOpen className="h-6 w-6" />,
        'art': <BookOpen className="h-6 w-6" />,
        'physics': <Award className="h-6 w-6" />,
        'chemistry': <Award className="h-6 w-6" />,
        'biology': <Award className="h-6 w-6" />,
      };
      
      for (const [key, icon] of Object.entries(iconMap)) {
        if (title.toLowerCase().includes(key)) {
          return icon;
        }
      }
      
      return <BookOpen className="h-6 w-6" />;
    };
    
    const design = getCardDesign();
    
    // Render different layouts based on education level
    if (design.layout === 'simple') {
      // 10th Grade - Simple, colorful design
      return (
        <motion.div
          onClick={handleNavigation}
          className={`group ${design.containerClass} p-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 h-full`}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className={`${design.iconStyle} w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
              {getSubjectIcon()}
            </div>
            <h3 className={design.titleStyle}>{title}</h3>
            <div className="bg-green-400/20 rounded-full px-4 py-2 mb-4">
              <span className="text-green-100 text-sm font-medium">{stats.students}K+ Students</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
              Start Learning
            </button>
          </div>
        </motion.div>
      );
    }
    
    if (design.layout === 'modern') {
      // Intermediate - Card with side layout
      return (
        <motion.div
          onClick={handleNavigation}
          className={`group ${design.containerClass} p-5 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 h-full overflow-hidden`}
          whileHover={{ scale: 1.03, rotateY: 5 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-start space-x-4">
            <div className={design.iconStyle}>
              {getSubjectIcon()}
            </div>
            <div className="flex-1">
              <h3 className={design.titleStyle}>{title}</h3>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-blue-300" />
                  <span className="text-blue-200 text-xs">{stats.students}K</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-blue-300" />
                  <span className="text-blue-200 text-xs">{stats.duration}h</span>
                </div>
              </div>
              <div className="w-full bg-blue-800/30 rounded-full h-1 mb-3">
                <motion.div 
                  className="h-full bg-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <button className="text-blue-300 hover:text-blue-200 text-sm font-medium flex items-center space-x-1">
                <span>Explore</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (design.layout === 'glass') {
      // UG - Glass morphism design
      return (
        <motion.div
          onClick={handleNavigation}
          className={`group ${design.containerClass} p-6 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 h-full backdrop-blur-lg`}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full -mr-10 -mt-10"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className={design.iconStyle}>
                {getSubjectIcon()}
              </div>
              <div className="bg-purple-500/20 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 text-yellow-300 fill-current" />
              </div>
            </div>
            
            <h3 className={design.titleStyle}>{title}</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-purple-600/20 rounded-lg p-2 text-center">
                <div className="text-purple-200 text-sm font-semibold">{stats.students}K+</div>
                <div className="text-purple-300/70 text-xs">Students</div>
              </div>
              <div className="bg-purple-600/20 rounded-lg p-2 text-center">
                <div className="text-purple-200 text-sm font-semibold">{stats.courses}</div>
                <div className="text-purple-300/70 text-xs">Courses</div>
              </div>
            </div>
            
            <motion.button
              className="w-full bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 rounded-lg py-2 px-4 text-purple-100 font-medium transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Enroll Now
            </motion.button>
          </div>
        </motion.div>
      );
    }
    
    if (design.layout === 'professional') {
      // PG - Professional, minimalist design
      return (
        <motion.div
          onClick={handleNavigation}
          className={`group ${design.containerClass} p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 h-full`}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="border-l-4 border-gray-500 pl-4">
            <div className="flex items-center justify-between mb-3">
              <div className={design.iconStyle}>
                {getSubjectIcon()}
              </div>
              <div className="text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded">
                Advanced
              </div>
            </div>
            
            <h3 className={design.titleStyle}>{title}</h3>
            
            <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
              <span>{stats.students}K+ Enrolled</span>
              <span>{stats.duration} Hours</span>
            </div>
            
            <div className="border-t border-gray-600/50 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Research Focus</span>
                <motion.button
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
    
    // Default fallback
    return (
      <motion.div
        onClick={handleNavigation}
        className={`group ${design.containerClass} p-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 h-full`}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={design.iconStyle}>
          {getSubjectIcon()}
        </div>
        <h3 className={design.titleStyle}>{title}</h3>
        <button className="mt-auto bg-white/20 text-white px-4 py-2 rounded">
          Learn More
        </button>
      </motion.div>
    )
}

export default Contentcard