// components/JobCard.jsx
import { Briefcase, MapPin, BadgeCheck, Banknote } from "lucide-react";

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

export default function JobCard({ job }) {
  const domain = orgDomainMap[job.organization];
  const logoSrc = job.logo && job.logo.startsWith("http")
    ? job.logo
    : domain
    ? `https://logo.clearbit.com/${domain}`
    : job.logo || "/logo.png";

  const tagStyle = (tag) => {
    const t = String(tag || "").toLowerCase();
    if (t.includes("intern")) return "bg-amber-500/20 text-amber-300 border-amber-400/30";
    if (t.includes("contract")) return "bg-rose-500/20 text-rose-300 border-rose-400/30";
    return "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"; // full-time default
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/60 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-900/20">
      {/* Accent gradient ring */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10" />

      <div className="p-5 flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          <img src={logoSrc} alt={job.title} className="w-10 h-10 object-contain" onError={(e)=>{e.currentTarget.src='/logo.png'}} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white truncate flex items-center gap-2">
            {job.title}
            <BadgeCheck className="w-4 h-4 text-purple-400" />
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 truncate">{job.organization}</p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <p className="text-sm text-gray-300 line-clamp-3 min-h-[3.6em]">{job.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tag && (
            <span className={`text-[11px] px-2 py-1 rounded-full border ${tagStyle(job.tag)}`}>
              <Briefcase className="inline w-3.5 h-3.5 mr-1" /> {job.tag}
            </span>
          )}
          {job.location && (
            <span className="text-[11px] px-2 py-1 rounded-full border bg-blue-500/20 text-blue-200 border-blue-400/30">
              <MapPin className="inline w-3.5 h-3.5 mr-1" /> {job.location}
            </span>
          )}
          {job.mode && (
            <span className="text-[11px] px-2 py-1 rounded-full border bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
              {job.mode}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <Banknote className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
          <span className="text-xs text-gray-400">Starts {job.startDate}</span>
        </div>

        <div className="mt-4">
          <span className="inline-block text-sm font-medium text-white/90 group-hover:text-white transition-colors">View Pathway →</span>
        </div>
      </div>
    </div>
  );
}