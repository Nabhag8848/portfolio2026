import { Link } from "react-router-dom";
import { profiles } from "../data/profiles";

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
              href={profiles.github}
            >
              Github
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={profiles.twitter}
            >
              Twitter
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={profiles.linkedin}
            >
              LinkedIn
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={profiles.leetcode}
            >
              LeetCode
            </a>
            <a href={profiles.mail}>Mail</a>
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
