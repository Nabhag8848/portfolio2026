import { Link } from "react-router-dom";

function LeftColumn() {
  return (
    <div className="left-col">
      <div className="nabhag-intro">
        <div
          style={{
            margin: "0px",
            gap: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>Nabhag Motivaras</h1>
          <p style={{ margin: 0, color: "#999" }}>Applied AI Engineer</p>
          <span className="nav-links">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Nabhag8848"
            >
              Github
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://x.com/NabhagMotivaras"
            >
              Twitter
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://linkedin.com/in/nabhagmotivaras"
            >
              LinkedIn
            </a>
            <a href="mailto:motivaras.nabhag@gmail.com">Mail</a>
          </span>
        </div>
      </div>
      <div className="divider" />
      <div className="music">
        <Link className="contributions-badge" to="/contributions">
          <span className="pulse-dot" />
          Contributions
        </Link>
      </div>
    </div>
  );
}

export default LeftColumn;
