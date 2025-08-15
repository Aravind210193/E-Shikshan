// components/JobCard.jsx
export default function JobCard({ job }) {
  return (
    <div className="bg-gradient-to-r from-[#0F2027] to-[#010b0e]  rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-4 flex items-center space-x-4">
        <img src={job.logo} alt={job.title} className="h-12 w-12 object-contain" />
        <div>
          <h2 className="text-lg font-semibold">{job.title}</h2>
          <p className="text-sm text-gray-600">{job.organization}</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{job.tag}</span>
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{job.location}</span>
        </div>
        <p className="mt-2 text-green-600 font-semibold">{job.salary}</p>
        <a href={job.link} className="block mt-3 text-blue-500 text-sm">View Pathway →</a>
      </div>
    </div>
  );
}