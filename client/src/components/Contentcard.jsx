const Contentcard = ({ content, onSelect }) => (
  <div
    className="border p-4 rounded shadow bg-red-400 cursor-pointer hover:bg-gray-700"
    onClick={() => onSelect(content)}
  >
    <h2 className="text-lg font-semibold ">{content.title}</h2>
    <p>{content.description}</p>
  </div>
);

export default Contentcard