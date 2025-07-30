import { Link } from "react-router-dom";
const CourseDetail = ({ course, onBack }) => (
  <div>
    <button onClick={onBack} className=" mb-4 px-2 py-1 bg-blue-500 text-white rounded">← Back</button>
    <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
    <p>{course.description}</p>

    <Link to='/' className="font-semibold mt-4 cursor-pointer">Videos
    <ul>{course.videos.map((v, i) => <li key={i}>{v}</li>)}</ul>
    </Link>
    <h3 className="font-semibold mt-2">PDFs</h3>
    <ul>{course.pdfs.map((p, i) => <li key={i}>{p}</li>)}</ul>

    <h3 className="font-semibold mt-2">Quizzes</h3>
    <ul>{course.quizzes.map((q, i) => <li key={i}>{q}</li>)}</ul>

    <h3 className="font-semibold mt-2">Challenges</h3>
    <ul>{course.challenges.map((c, i) => <li key={i}>{c}</li>)}</ul>
  </div>
);

export default CourseDetail;