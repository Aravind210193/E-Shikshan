const CourseCard = ({ course, onSelect }) => (
  <div
    className="border p-4 rounded shadow bg-green-400 cursor-pointer hover:bg-gray-800"
    onClick={() => onSelect(course)}
  >
    <h2 className="text-lg font-semibold">{course.title}</h2>
    <p>{course.description}</p>
  </div>
);

export default CourseCard;