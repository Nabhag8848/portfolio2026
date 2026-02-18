import HeaderTop from "../components/headers/HeaderTop";

function GenericProject({ project, onBack }) {
  return (
    <div>
      <div className="overview">
        <HeaderTop project={project} onBack={onBack} />
        <div className="project-media">
          {project.type === "video" ? (
            <video src={project.src} width="100%" muted autoPlay loop playsInline />
          ) : project.type === "image" || project.image ? (
            <img alt={project.desc} src={project.src || project.image} width="100%" />
          ) : (
            <div className="asset-placeholder">
              {project.title} — add project asset here
            </div>
          )}
        </div>
      </div>

      <div className="divider" />

      <p
        style={{
          paddingTop: "30px",
          paddingLeft: "30px",
          paddingRight: "30px",
          marginBottom: "20px",
          textAlign: "justify",
        }}
      >
        {project.about}
      </p>

      {project.demoLink && (
        <p style={{ paddingLeft: "30px", paddingRight: "30px" }}>
          <a
            className="green-link"
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            see demo
          </a>
        </p>
      )}

      <div className="project-quick-info">
        {project.tech && (
          <div className="info">
            <h2>Technology</h2>
            <ul>
              {project.tech.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {project.link && (
          <div className="info">
            <h2>Link</h2>
            <ul>
              <a target="_blank" rel="noopener noreferrer" href={project.link}>
                See live↗
              </a>
            </ul>
          </div>
        )}

        {project.gh && (
          <div className="info">
            <h2>Github</h2>
            <ul>
              <a target="_blank" rel="noopener noreferrer" href={project.gh}>
                Repo↗
              </a>
            </ul>
          </div>
        )}
      </div>

      <div className="divider" />
    </div>
  );
}

export default GenericProject;
