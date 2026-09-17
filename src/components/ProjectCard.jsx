function ProjectCard({ project, onClick }) {
  return (
    <div onClick={onClick} className="project-card">
      {project.type === "video" ? (
        <video
          src={project.src}
          width="100%"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
        />
      ) : project.type === "placeholder" ? null : (
        <img src={project.src} alt={project.title} width="100%" />
      )}
      {project.type !== "placeholder" && (
        <div
          style={{
            marginTop: "8px",
            gap: "20px",
            marginBottom: "0px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <p style={{ margin: "0px" }}>{project.title}</p>
          <p style={{ margin: "0px", color: "#666", fontSize: "11px" }}>
            {project.category}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
