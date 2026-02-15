const RoadmapCard = ({ skill, onSelect }) => (
  
  <a
    href={skill.url}
    target="_blank"
  >
    <div
        className="border p-4 rounded shadow  cursor-pointer bg-gray-700 hover:bg-gray-800"
        onClick={() => onSelect(skill)}
    >
        <h2 className="text-lg font-semibold ">{skill.name}</h2>
    </div>
  </a>
);

export default RoadmapCard;