import { projects } from "../data/Projects";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Work({ activeFilter, onFilterChange }) {
  const filters = ["all", "integrations", "extensions", "tools", "templates"];
  const navigate = useNavigate();

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const handleProjectClick = (project) => {
    if (project?.id) navigate(`/projects/${project.id}`);
  };

  const handleFilterClick = (filter) => {
    onFilterChange(filter);
  };

  return (
    <div className="terminal-container">
      <h3 className="section-header">Projects</h3>
      <nav className="terminal-nav">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`nav-button ${activeFilter === filter ? "active" : ""}`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
      </nav>

      <div className="divider"></div>

      <div className="terminal-content">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-row"
            onClick={() => handleProjectClick(project)}
          >
            <div>{project.title}</div>
            <div>{project.desc}</div>
            <div className="project-time">
              <span className="time-text">{project.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Work;
