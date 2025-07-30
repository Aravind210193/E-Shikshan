import {Link} from 'react-router-dom'
const ContentDetail = ({ content, onBack }) => (
  <div>
    <button onClick={onBack} className="mb-4 px-2 py-1 bg-green-600 text-white rounded">← Back</button>
    <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
    <p>{content.description}</p>

    <Link to='/' className="font-semibold mt-4">Videos</Link>
    <ul>{content.videos.map((v, i) => <li key={i}>{v}</li>)}</ul>

    <h3 className="font-semibold mt-2">PDFs</h3>
    <ul>{content.pdfs.map((p, i) => <li key={i}>{p}</li>)}</ul>

    <h3 className="font-semibold mt-2">Quizzes</h3>
    <ul>{content.quizzes.map((q, i) => <li key={i}>{q}</li>)}</ul>

    <h3 className="font-semibold mt-2">Challenges</h3>
    <ul>{content.challenges.map((c, i) => <li key={i}>{c}</li>)}</ul>
  </div>
);

export default ContentDetail;