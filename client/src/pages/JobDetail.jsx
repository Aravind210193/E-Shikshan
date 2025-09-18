// pages/JobDetail.jsx
import { useParams } from "react-router-dom";
import jobData from "../data/jobProfile.json";

export default function JobDetail() {
  const { id } = useParams();
  const job = jobData.find(j => j.id === parseInt(id));

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-2xl font-semibold text-gray-600">Job not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header Section */}
          <div className="bg-gray-500 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img 
                src={job.logo} 
                alt={job.title} 
                className="h-24 w-24 sm:h-32 sm:w-32 object-contain bg-white rounded-xl shadow-lg p-2 transform transition-transform duration-300 hover:scale-105" 
              />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{job.title}</h1>
                <p className="text-xl text-blue-100 font-medium">{job.organization}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { icon: "⏳", label: "Duration", value: job.duration },
                { icon: "📅", label: "Starts", value: job.startDate },
                { icon: "🕒", label: "Time", value: job.timePerWeek },
                { icon: "👨‍🏫", label: "Mode", value: job.mode },
                { icon: "📜", label: "Credential", value: job.credential }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                  <div className="font-medium dark:text-gray-200">{item.value}</div>
                </div>
              ))}
            </div>

            {/* About Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About this Role</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{job.about}</p>
            </section>

            {/* Curriculum Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Pathway / Curriculum</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.curriculum.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Skills Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Required Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {job.skills.map((skill, index) => (
                  <div key={index} className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 transform transition-all duration-300 hover:scale-105">
                    <span className="text-gray-800 dark:text-gray-200">{skill}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Responsibilities Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilites.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How to Become Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Career Path Guide</h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                <ul className="space-y-4">
                  {job.howto.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-blue-500 font-bold">{index + 1}.</span>
                      <span className="text-gray-600 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}