import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import hackathons from "../data/hackathons.json";

export default function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hackathon = hackathons.find((h) => h.id === parseInt(id));

  if (!hackathon) {
    return <h2 className="text-center text-red-500 mt-10">Hackathon not found</h2>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-16">
      {/* Hero Section */}
      <div
        className="relative h-72 flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${hackathon.bgimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className=" bg-opacity-50 p-6 rounded-lg text-center">
          <h1 className="text-4xl font-bold">{hackathon.title}</h1>
          <p className="mt-2 text-lg">{hackathon.tagline}</p>
          <p className="mt-1 text-sm">{hackathon.date}</p>
          <a
            href={hackathon.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Register Now
          </a>
        </div>
      </div>

      {/* Prize & Dates */}
      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Card title="💰 Prize" content={hackathon.prize} />
        <Card title="📅 Registration Closes" content={hackathon.registrationCloses} />
        <Card title="🕒 Submission Deadline" content={hackathon.submissionDeadline} />
      </div>

      {/* Overview */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-4">Overview</h2>
        <p className="bg-gray-800 p-6 rounded-lg text-lg leading-relaxed text-gray-300">
          {hackathon.overview}
        </p>
      </div>

      {/* How it Works */}
      <div className="max-w-4xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-500">How It Works</h2>
        <ul className="space-y-4 text-lg text-gray-300">
          {hackathon.howit.map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-pink-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      <SectionGrid title="About" items={hackathon.about} />
      <SectionGrid title="Who Can Participate" items={hackathon.whoCanParticipate} />
      <SectionGrid title="Challenges" items={hackathon.challenges} />

      {/* Back Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/hackathons")}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition"
        >
          Back to Hackathons
        </button>
      </div>
    </div>
  );
}

function Card({ title, content }) {
  return (
    <div className="bg-gray-800 shadow p-5 rounded-lg">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <p className="text-gray-300">{content}</p>
    </div>
  );
}

function SectionGrid({ title, items }) {
  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border border-gray-700 shadow p-5 rounded-md flex flex-col items-center text-center"
          >
            {item.icon && (
              <img
                src={item.icon}
                alt={item.title}
                className="w-40 h-30 mb-3 object-contain"
              />
            )}
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
