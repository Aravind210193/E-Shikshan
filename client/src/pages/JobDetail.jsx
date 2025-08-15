// pages/JobDetail.jsx
import { useParams } from "react-router-dom";
import jobData from "../data/jobProfile.json";

export default function JobDetail() {
  const { id } = useParams();
  const job = jobData.find(j => j.id === parseInt(id));

  if (!job) return <p className="p-6">Job not found</p>;

  return (
    <div className="max-w-5xl mt-2 bg-gray-600 mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1 bg-gray-900 p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <img src={job.logo} alt={job.title} className="h-50 w-50  object-contain" />
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-gray-600 font-semibold ">{job.organization}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-700">
            <p>⏳ {job.duration}</p>
            <p>📅 Starts {job.startDate}</p>
            <p>🕒 {job.timePerWeek} per week</p>
            <p>👨‍🏫 {job.mode}</p>
            <p>📜 {job.credential}</p>
          </div>

          <h2 className="mt-6 text-3xl  font-bold">About this Role</h2>
          <p className="mt-2 text-lg flex justify-center font-semibold text-gray-700">{job.about}</p>

          <h2 className="mt-6 mb-4 text-xl font-semibold">Pathway / Curriculum</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {job.curriculum.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul> 
          <div>
          <h4 className=" mt-3 text-semibold text-2xl text-orange-500 font-bold">Skills Required for Software Enginner</h4>
            <ul className="list-disc text-gray-200 text-lg font-semibold pl-5 mt-2 space-y-1">
            {job.skills.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          </div>
            <div>
            <h1 className= " text-2xl mt-4 font-black text-gray-400 ">Resoponsibilities of software engineer</h1>
            {
                job.responsibilites.map((item,index)=>(
                    <li key={index}>{item}</li>
                ))
            }
            </div>

            <div>
                <h1 className= " text-2xl mt-4 font-black text-gray-400 ">How to Become a Software Engineer</h1>
            {
                job.howto.map((item,index)=>(
                    <li key={index}>{item}</li>
                ))
            }
            </div>
        </div>
      </div>
    </div>
  );
}