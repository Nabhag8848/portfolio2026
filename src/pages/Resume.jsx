import { Link } from "react-router-dom";

export default function Resume() {
  const resumeUrl =
    "https://drive.google.com/file/d/1iERQ-GjHoHi0l72JEtrk3-laij1dqSCA/preview";

  return (
    <div className="resume-container">
      <Link to="/" className="blog-back-link">
        ← Back
      </Link>
      <iframe
        className="resume-iframe"
        src={resumeUrl}
        title="Resume"
        allow="autoplay"
      />
    </div>
  );
}
