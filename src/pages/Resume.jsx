import { Link } from "react-router-dom";

export default function Resume() {
  const resumeUrl =
    "https://drive.google.com/file/d/1bOPk4Wy_pcEKPd_JeOiU67gG_kMHOKPQ/preview";

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
