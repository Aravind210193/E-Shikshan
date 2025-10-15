// pages/JobDetail.jsx
import { useParams, Link } from "react-router-dom";
import jobData from "../data/jobProfile.json";
import { Clock, Calendar, Briefcase, Award, Users, ChevronRight, Star } from "lucide-react";

const Section = ({ title, children, icon }) => (
  <section className="mb-8">
    <h2 className="flex items-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-4">
      {icon}
      <span className="ml-3">{title}</span>
    </h2>
    <div className="text-gray-300 leading-relaxed space-y-4">{children}</div>
  </section>
);

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/60">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-base font-semibold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default function JobDetail() {
  const { id } = useParams();
  const job = jobData.find(j => j.id === parseInt(id));

  if (!job) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-2xl font-semibold text-gray-400">Job not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="relative bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl shadow-2xl shadow-black/30 overflow-hidden mb-8 sm:mb-12 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={job.logo} 
              alt={`${job.title} logo`}
              className="h-28 w-28 object-contain bg-white/10 rounded-2xl shadow-lg p-3 ring-2 ring-pink-500/30" 
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2">{job.title}</h1>
              <p className="text-xl text-purple-300 font-medium">{job.organization}</p>
            </div>
            <div className="flex-shrink-0">
              <Link 
                to="#" 
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-lg font-semibold text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-lg">
              <Section title="About this Role" icon={<Briefcase className="text-pink-400" />}>
                <p>{job.about}</p>
              </Section>

              <Section title="Key Responsibilities" icon={<Star className="text-pink-400" />}>
                <ul className="space-y-3">
                  {job.responsibilites.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <ChevronRight className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Learning Pathway" icon={<Briefcase className="text-pink-400" />}>
                <ul className="space-y-3">
                  {job.curriculum.map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <ChevronRight className="text-purple-400 flex-shrink-0" size={18} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Career Path Guide" icon={<Award className="text-pink-400" />}>
                <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700/50">
                  <ul className="space-y-4">
                    {job.howto.map((item, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white">
                          {index + 1}
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            </div>
          </div>

          {/* Right Column */}
          <aside className="space-y-8">
            {/* Quick Info */}
            <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-5">
                Role Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <InfoCard icon={<Clock className="w-7 h-7 text-pink-400" />} label="Duration" value={job.duration} />
                <InfoCard icon={<Calendar className="w-7 h-7 text-pink-400" />} label="Starts" value={job.startDate} />
                <InfoCard icon={<Briefcase className="w-7 h-7 text-pink-400" />} label="Time Commitment" value={job.timePerWeek} />
                <InfoCard icon={<Users className="w-7 h-7 text-pink-400" />} label="Mode" value={job.mode} />
                <InfoCard icon={<Award className="w-7 h-7 text-pink-400" />} label="Credential" value={job.credential} />
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-5">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-gradient-to-r from-pink-600/30 to-purple-700/30 border border-pink-500/30 px-4 py-2 rounded-full text-sm font-medium text-gray-200 transition-all duration-300 hover:from-pink-600/40 hover:to-purple-700/40 hover:shadow-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
          </aside>
        </main>
      </div>
    </div>
  );
}