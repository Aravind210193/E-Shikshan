import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Trophy, 
  Users, 
  Target, 
  Zap, 
  Star, 
  Award, 
  CheckCircle, 
  ExternalLink,
  Timer,
  Gift,
  Lightbulb,
  Rocket,
  Shield
} from "lucide-react";
import hackathons from "../data/hackathons.json";

export default function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hackathon = hackathons.find((h) => h.id === parseInt(id));

  if (!hackathon) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-red-600/20 p-8 rounded-2xl border border-red-500/30">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Hackathon Not Found</h2>
            <p className="text-gray-400">The requested hackathon could not be found.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative">
        <div
          className="relative h-96 md:h-[500px] lg:h-[600px] flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(79,70,229,0.3), rgba(219,39,119,0.3)), url(${hackathon.bgimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-60"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
              />
            ))}
          </div>

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4 max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="bg-black/30 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                {hackathon.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-4 font-light">
                {hackathon.tagline}
              </p>
              <div className="flex items-center justify-center space-x-4 text-pink-300 mb-8">
                <Calendar className="h-5 w-5" />
                <span className="text-lg">{hackathon.date}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.a
                  href={hackathon.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="h-5 w-5" />
                  <span>Register Now</span>
                  <ExternalLink className="h-4 w-4" />
                </motion.a>
                
                <motion.button
                  onClick={() => navigate("/hackathons")}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-2xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Hackathons</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Prize & Dates Section */}
      <div className="max-w-7xl mx-auto -mt-20 relative z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          <EnhancedCard 
            icon={<Trophy className="h-8 w-8" />} 
            title="Prize Pool" 
            content={hackathon.prize}
            gradient="from-yellow-400 to-orange-500"
            bgGradient="from-yellow-500/20 to-orange-500/20"
          />
          <EnhancedCard 
            icon={<Timer className="h-8 w-8" />} 
            title="Registration Closes" 
            content={hackathon.registrationCloses}
            gradient="from-blue-400 to-indigo-500"
            bgGradient="from-blue-500/20 to-indigo-500/20"
          />
          <EnhancedCard 
            icon={<Clock className="h-8 w-8" />} 
            title="Submission Deadline" 
            content={hackathon.submissionDeadline}
            gradient="from-pink-400 to-red-500"
            bgGradient="from-pink-500/20 to-red-500/20"
          />
        </motion.div>
      </div>

      {/* Enhanced Overview Section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Overview
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl border border-gray-700/50 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-start space-x-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">About This Hackathon</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-light">
            {hackathon.overview}
          </p>
        </motion.div>
      </div>

      {/* Enhanced How it Works Section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hackathon.howit.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 text-lg leading-relaxed">{item}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Sections */}
      <EnhancedSectionGrid 
        title="About" 
        items={hackathon.about} 
        gradient="from-purple-400 to-indigo-400"
        icon={<Star className="h-6 w-6" />}
      />
      <EnhancedSectionGrid 
        title="Who Can Participate" 
        items={hackathon.whoCanParticipate} 
        gradient="from-green-400 to-teal-400"
        icon={<Users className="h-6 w-6" />}
      />
      <EnhancedSectionGrid 
        title="Challenges" 
        items={hackathon.challenges} 
        gradient="from-red-400 to-pink-400"
        icon={<Target className="h-6 w-6" />}
      />

      {/* Enhanced Footer Section */}
      <div className="max-w-6xl mx-auto mt-20 px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900 to-pink-900 p-8 md:p-12 rounded-3xl border border-purple-500/30 text-center shadow-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-full w-fit mx-auto mb-6"
          >
            <Gift className="h-12 w-12 text-white" />
          </motion.div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Innovate?
          </h3>
          <p className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers, designers, and innovators in this exciting hackathon journey. 
            Build something amazing and win incredible prizes!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.a
              href={hackathon.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-5 w-5" />
              <span>Register Now</span>
              <ExternalLink className="h-4 w-4" />
            </motion.a>
            
            <motion.button
              onClick={() => navigate("/hackathons")}
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Hackathons</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced Card Component
function EnhancedCard({ icon, title, content, gradient, bgGradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-gradient-to-br ${bgGradient} backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300`}
    >
      <div className="text-center">
        <motion.div
          className={`bg-gradient-to-r ${gradient} p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {React.cloneElement(icon, { className: "h-8 w-8 text-white" })}
        </motion.div>
        <h2 className="font-bold text-xl md:text-2xl mb-4 text-white">{title}</h2>
        <p className="text-gray-200 text-lg font-medium">{content}</p>
      </div>
    </motion.div>
  );
}

// Enhanced Section Grid Component
function EnhancedSectionGrid({ title, items, gradient, icon }) {
  return (
    <div className="max-w-7xl mx-auto mt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className={`bg-gradient-to-r ${gradient} p-3 rounded-2xl`}>
            {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h2>
        </div>
        <div className={`w-24 h-1 bg-gradient-to-r ${gradient} mx-auto rounded-full`}></div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-xl hover:shadow-2xl p-8 rounded-3xl flex flex-col items-center text-center transition-all duration-300 group"
          >
            {item.icon && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mb-6 overflow-hidden rounded-2xl shadow-lg"
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain bg-white/10 p-4 rounded-2xl"
                />
              </motion.div>
            )}
            
            <div className={`w-12 h-1 bg-gradient-to-r ${gradient} rounded-full mb-4 group-hover:w-16 transition-all duration-300`}></div>
            
            <h3 className="font-bold text-xl md:text-2xl mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
              {item.title}
            </h3>
            
            <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
              {item.description}
            </p>
            
            <motion.div
              className={`mt-6 p-3 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              whileHover={{ scale: 1.1 }}
            >
              <CheckCircle className="h-5 w-5 text-white" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
