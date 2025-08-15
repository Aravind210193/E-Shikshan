import React from "react";
import { useParams } from "react-router-dom";
import hackathons from "../data/hackathons.json";

export default function HackathonDetails() {
  const { id } = useParams();
  const hackathon = hackathons.find((h) => h.id === parseInt(id));

  if (!hackathon) {
    return <h2 className="text-center text-red-500 mt-10">Hackathon not found</h2>;
  }

  return (
    
    <div className="hackathon-details">
      <div className="bg-gray-800 h-auto w-auto">
      {/* Header Section with Background Image */}
      <div
        className="relative h-72 flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${hackathon.bgimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex justify-center flex-col items-center bg-opacity-50 p-5 rounded-lg">
          <h1 className="text-4xl font-bold">{hackathon.title}</h1>
          <p className="mt-2 text-lg">{hackathon.tagline}</p>
          <p className="mt-1 text-sm">{hackathon.date}</p>
          <a
            href={hackathon.registrationUrl}
            target="_blank"
            rel="noopener noreferre"
            className="mt-4 inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Register Now</a>
        </div>
      </div>

      {/* Prize & Dates */}
      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-gray-900 shadow p-5 rounded-lg">
          <h2 className="font-bold text-lg">💰 Prize</h2>
          <p>{hackathon.prize}</p>
        </div>
        <div className="bg-gray-900 shadow p-5 rounded-lg">
          <h2 className="font-bold text-lg">📅 Registration Closes</h2>
          <p>{hackathon.registrationCloses}</p>
        </div>
        <div className="bg-gray-900 shadow p-5 rounded-lg">
          <h2 className="font-bold text-lg">🕒 Submission Deadline</h2>
          <p>{hackathon.submissionDeadline}</p>
        </div>
      </div>
      <h1 className="mt-10 flex justify-around font-bold text-2xl">Overview</h1>
     <div className=" ml-30 w-auto  mt-2 flex justify-center   ">
        {
          hackathon.overview
        }
      </div>
      <h1 className="flex justify-center text-pink-600 font-semibold mt-3 text-2xl">How it works ?</h1>
     <div className="mt-10 flex flex-col justify-center ml-20 text-xl">
        {
          hackathon.howit.map((item,index)=>(
            <div key={index}>{item}</div>
          ))
        }
        </div>
    

      {/* About Section */}
       <SectionGrid title="About" items={hackathon.about} /> 

      {/* Who Can Participate Section */}
      <SectionGrid title="Who Can Participate" items={hackathon.whoCanParticipate} />

      {/* Challenges Section */}
      <SectionGrid title="Challenges " items={hackathon.challenges} />
    </div>
    </div>
  );
}

// Reusable Section Component
function SectionGrid({ title, items }) {
  return (
    <div className="max-w-5xl mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1a0b1a] border border-gray-200 shadow p-5 rounded-md flex flex-col items-center text-center"
          >
            {item.icon && (
              <img src={item.icon} alt={item.title} className="w-30 h-30 mb-3" />
            )}
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
}