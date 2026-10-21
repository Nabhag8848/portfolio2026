import { buildNotes, featuredProjects } from "../data/Projects";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Work() {
  const navigate = useNavigate();

  const handleProjectClick = (project) => {
    if (project?.id) {
      navigate(`/projects/${project.id}`, { replace: true });
    }
  };

  return (
    <div className="terminal-container">
      <h3 className="section-header">Projects</h3>
      <div className="divider"></div>

      <div className="terminal-content">
        {featuredProjects.map((project) => (
          <div
            key={project.id}
            className="project-row"
            onClick={() => handleProjectClick(project)}
          >
            <div>{project.title}</div>
            <div className="project-desc hide-on-mobile">{project.desc}</div>
            <div className="project-time">
              <time className="year-badge" dateTime={project.date}>
                {project.date}
              </time>
            </div>
          </div>
        ))}
      </div>

      <section className="build-notes" aria-labelledby="blog-title">
        <div className="build-notes-heading">
          <h3 className="section-header" id="blog-title">BLOGS</h3>
        </div>
        <div className="divider"></div>
        <div className="terminal-content">
          {buildNotes.map((project) => (
            <button
              key={project.id}
              className="project-row build-note-row"
              onClick={() => navigate(`/blog/${project.id}`, { replace: true })}
            >
              <span>{project.buildHeadline}</span>
              <span className="project-time">
                <time className="year-badge" dateTime={project.date}>{project.date}</time>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Work;
