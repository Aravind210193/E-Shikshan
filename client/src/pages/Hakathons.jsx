import { Link, useNavigate } from "react-router-dom";
import hackathons from "../data/hackathons.json";

export default function Hakathon() {
  const navigate = useNavigate();
  return (
    <div  className="bg-gray-900 min-h-screen text-white py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">Upcoming Hackathons</h1>
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {hackathons.map((hackathon) => (
          <div
          onClick={()=>navigate(`/hackathon/${hackathon.id}`)} 
            key={hackathon.id}
            className="bg-gray-800 border border-purple-100 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
          >
            {/* Image */}
            <img
              src={hackathon.image}
              alt={hackathon.title}
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{hackathon.title}</h2>
              <h2 className="text-lg text-gray-400  font-bold mb-2">{hackathon.tagline}</h2>
              <p className="text-gray-300 font-bold text-sm mb-4">
                {hackathon.startDate} to {hackathon.endDate}
              </p>
              <p className="text-gray-300 text-sm line-clamp-3 mb-2">
                {hackathon.description}
              </p>
              <Link
                to={`/hackathon/${hackathon.id}`}
                className="inline-block  bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}