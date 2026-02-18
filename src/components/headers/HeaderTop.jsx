import "../../App.css";

function HeaderTop({ project, onBack }) {
  return (
    <div style={{ padding: "30px", paddingBottom: "0px" }}>
      <div className="top">
        <button
          onClick={onBack}
          style={{
            width: "70px",
            display: "flex",
            justifyContent: "flex-start",
            padding: "0px",
          }}
        >
          ← back
        </button>
        <h1>{project.title}</h1>
        <p
          style={{ width: "70px", display: "flex", justifyContent: "flex-end" }}
          className="project-date"
        >
          {project.date}
        </p>
      </div>
    </div>
  );
}

export default HeaderTop;
