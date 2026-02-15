// ...existing code...
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jobsAPI } from "../services/api";
import { Clock, Calendar, Briefcase, Award, Users, ChevronRight, Star, MapPin, Banknote, Bookmark, Share2, BadgeCheck, Globe } from "lucide-react";

const Section = ({ title, children, icon }) => (
  <section className="mb-8">
    <h2 className="flex items-center text-2xl font-bold text-white mb-4">
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
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const { data } = await jobsAPI.getById(id);
        if (!ignore) {
          setJob(data?.job || null);
          if (data?.job?.category) {
            try {
              const allJobsResponse = await jobsAPI.getAll();
              const similar = (allJobsResponse?.data?.jobs || [])
                .filter(j => j.category === data.job.category && j._id !== id)
                .slice(0, 3);
              setSimilarJobs(similar);
            } catch (err) {
              console.error('Failed to fetch similar jobs:', err);
              setSimilarJobs([]);
            }
          }
        }
      } catch (e) {
        console.error(e);
        if (!ignore) setError(e?.response?.data?.message || 'Failed to load job');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);
  const orgDomainMap = {
    Google: "google.com",
    TCS: "tcs.com",
    Zoho: "zoho.com",
    Meta: "meta.com",
    LinkedIn: "linkedin.com",
    Canva: "canva.com",
    Netflix: "netflix.com",
    Infosys: "infosys.com",
    Paytm: "paytm.com",
    Amazon: "amazon.com",
    OpenAI: "openai.com",
    Swiggy: "swiggy.com",
    Adobe: "adobe.com",
    Spotify: "spotify.com",
    "Byju's": "byjus.com",
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-2xl font-semibold text-gray-400">Loading...</p>
    </div>
  );

  if (error || !job) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-2xl font-semibold text-gray-400">{error || 'Job not found'}</p>
    </div>
  );

  const domain = orgDomainMap[job.organization];
  const logoSrc = job.logo && job.logo.startsWith("http")
    ? job.logo
    : domain
    ? `https://logo.clearbit.com/${domain}`
    : job.logo || "/logo.png";
  const defaultHowTo = [
    "Review role requirements and tailor your resume",
    "Prepare a portfolio or GitHub with relevant projects",
    "Apply via the company careers page",
    "Prepare for technical and behavioral interviews",
  ];
  const defaultPerks = [
    "Health insurance",
    "Flexible work hours",
    "Remote-friendly policy",
    "Learning budget",
    "Paid time off",
    "Performance bonus",
  ];
  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="relative bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl shadow-2xl shadow-black/30 overflow-hidden mb-8 sm:mb-12 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={logoSrc}
              alt={`${job.title} logo`}
              onError={(e)=>{e.currentTarget.src='/logo.png'}}
              className="h-28 w-28 object-contain bg-white/10 rounded-2xl shadow-lg p-3 ring-2 ring-pink-500/30" 
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                {job.title}
                <BadgeCheck className="w-6 h-6 text-purple-400" />
              </h1>
              <p className="text-xl text-purple-300 font-medium flex items-center justify-center md:justify-start gap-2">
                {job.organization}
                {domain && (
                  <a href={`https://${domain}`} target="_blank" rel="noreferrer" className="text-sm text-blue-300 hover:text-blue-200 flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {domain}
                  </a>
                )}
              </p>
              <div className="mt-3 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                {job.tag && (
                  <span className="text-xs px-2 py-1 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-400/30">{job.tag}</span>
                )}
                {job.location && (
                  <span className="text-xs px-2 py-1 rounded-full border bg-blue-500/20 text-blue-200 border-blue-400/30 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                )}
                {job.mode && (
                  <span className="text-xs px-2 py-1 rounded-full border bg-indigo-500/20 text-indigo-200 border-indigo-400/30">{job.mode}</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <a 
                href={job.applyUrl || "#"} target="_blank" rel="noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Apply Now
              </a>
              <div className="flex items-center justify-center md:justify-end gap-3 mt-3">
                <button className="px-4 py-2 text-sm rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Bookmark className="w-4 h-4" /> Save
                </button>
                <button className="px-4 py-2 text-sm rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-lg">
              <Section title="About this Role" icon={<Briefcase className="text-pink-400" />}>
                <p>{job.about}</p>
              </Section>

              <Section title="Key Responsibilities" icon={<Star className="text-pink-400" />}>
                <ul className="space-y-3">
                  {(job.responsibilities || job.responsibilites || []).map((item, index) => (
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

              <Section title="How to Get This Job" icon={<Award className="text-pink-400" />}>
                <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700/50">
                  <ul className="space-y-4">
                    {(job.howto && job.howto.length ? job.howto : defaultHowTo).map((item, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
                          {index + 1}
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              <Section title="Perks & Benefits" icon={<Star className="text-pink-400" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(job.benefits && job.benefits.length ? job.benefits : defaultPerks).map((perk) => (
                    <div key={perk} className="flex items-center gap-2 bg-gray-900/40 border border-gray-700/60 rounded-lg px-3 py-2">
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-gray-200">{perk}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {similarJobs.length > 0 && (
                <Section title="Similar Roles" icon={<Star className="text-pink-400" />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {similarJobs.map((s) => (
                      <Link key={s._id} to={`/jobs/${s._id}`} className="block bg-gray-900/40 border border-gray-700/60 rounded-xl p-4 hover:border-purple-500/40 transition-colors">
                        <div className="text-white font-semibold">{s.title}</div>
                        <div className="text-sm text-gray-400">{s.organization}</div>
                      </Link>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
          <aside className="space-y-8 lg:sticky lg:top-24 self-start">
            <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5">
              <div className="flex flex-col gap-3">
                <a 
                  href={job.applyUrl || "#"} target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg"
                >
                  Apply for this role
                </a>
                <div className="flex items-center gap-2">
                  <button className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <Bookmark className="w-4 h-4" /> Save
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-5">
                Role Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <InfoCard icon={<Clock className="w-7 h-7 text-pink-400" />} label="Duration" value={job.duration} />
                <InfoCard icon={<Calendar className="w-7 h-7 text-pink-400" />} label="Starts" value={job.startDate} />
                <InfoCard icon={<Briefcase className="w-7 h-7 text-pink-400" />} label="Time Commitment" value={job.timePerWeek} />
                <InfoCard icon={<Users className="w-7 h-7 text-pink-400" />} label="Mode" value={job.mode} />
                <InfoCard icon={<Award className="w-7 h-7 text-pink-400" />} label="Credential" value={job.credential} />
                <InfoCard icon={<MapPin className="w-7 h-7 text-pink-400" />} label="Location" value={job.location} />
                <InfoCard icon={<Banknote className="w-7 h-7 text-pink-400" />} label="Salary Range" value={job.salary} />
                {job.experienceLevel && <InfoCard icon={<Star className="w-7 h-7 text-pink-400" />} label="Experience" value={job.experienceLevel} />}
                {job.openings && <InfoCard icon={<Users className="w-7 h-7 text-pink-400" />} label="Openings" value={`${job.openings} positions`} />}
              </div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-5">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-purple-600/30 border border-purple-500/40 px-4 py-2 rounded-full text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-purple-600/40 hover:shadow-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-5">
                Company
              </h2>
              <div className="flex items-center gap-4">
                <img src={logoSrc} alt={job.organization} className="w-12 h-12 rounded-xl bg-white/10 p-2 border border-white/10" onError={(e)=>{e.currentTarget.src='/logo.png'}} />
                <div>
                  <div className="text-white font-semibold">{job.organization}</div>
                  {domain && (
                    <a href={`https://${domain}`} target="_blank" rel="noreferrer" className="text-sm text-blue-300 hover:text-blue-200 flex items-center gap-1">
                      <Globe className="w-4 h-4" /> {domain}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}