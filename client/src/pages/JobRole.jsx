// pages/JobProfiles.jsx
import { Link } from "react-router-dom";
import jobData from "../data/jobProfile.json";
import JobCard from "../components/JobCard";

export default function JobRole() {
  return (
    <div className="p-6 bg-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobData.map(job => (
        <Link key={job.id} to={`/jobs/${job.id}`}>
          <JobCard job={job} />
        </Link>
      ))}
    </div>
  );
}