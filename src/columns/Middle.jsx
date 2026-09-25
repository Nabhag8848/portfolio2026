import { useEffect, useState } from "react";
import Work from "../components/Work";
import { useNavigate, useLocation, Link } from "react-router-dom";

function MiddleColumn() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const location = useLocation();

  useEffect(() => {
    const m = location.pathname.match(/^\/c\/(integrations|extensions|tools)$/);
    if (m) {
      setActiveFilter(m[1]);
    } else if (location.pathname === "/") {
      setActiveFilter("all");
    }
    // When on /projects/:id, don't change the filter — keep current selection
  }, [location.pathname]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    navigate(filter === "all" ? "/" : `/c/${filter}`);
  };

  return (
    <div>
      <p className="experience-desc">
        I'm a machine-like human living every day like it's a battlefield.
        Previously founding engineer at an integration startup, and first
        engineer at a healthcare company that scaled past $1M ARR. Now focused
        on applied AI infra, distributed systems, durable workflows, and agent
        orchestration at scale.
      </p>
      <p className="experience-desc">
        For more details, check out my{" "}
        <Link className="green-link" to="/resume">
          resume
        </Link>
        .
      </p>

      <div className="experience-section">
        <h3 className="section-header">Experience</h3>

        <div className="experience-item">
          <div className="experience-header">
            <span className="experience-company">Applied AI Consultant</span>
            <span className="experience-date">Dec 2025 – present</span>
          </div>
          <ul className="experience-desc experience-bullets">
            <li>Delivered NDA contracts, including a video-downloader extension, while focusing on workflow and sandbox infrastructure.</li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="experience-header">
            <Link className="experience-company" to="/blog/sabbatical">
              Health & Wellbeing
            </Link>
            <span className="experience-date">Jun 2025 – Nov 2025</span>
          </div>
          <ul className="experience-desc experience-bullets">
            <li>
              Recovered from severe Vitamin D3/B12 deficiencies that impaired cognition and communication.{" "}
              <Link className="green-link" to="/blog/sabbatical">Read the journey</Link>.
            </li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="experience-header">
            <a
              className="experience-company"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.rockethealth.app"
            >
              Rocket Health
            </a>
            <span className="experience-date">Sep 2024 - May 2025</span>
          </div>
          <ul className="experience-desc experience-bullets">
            <li>First engineer for a platform serving <span className="green-highlight">75K+ users</span>, <span className="green-highlight">250K+ teleconsults</span>, and <span className="green-highlight">$1M+ ARR</span>.</li>
            <li>
              Designed the core data platform and built auth, onboarding, scheduling, payments, and RBAC systems.{" "}
              <a className="green-link" href="https://dbdiagram.io/d/Prisma-Generated-66f4e6c53430cb846ca92ea6" target="_blank" rel="noopener noreferrer">Database schema</a>.
            </li>
            <li>Built a queue-backed webhook ingestion pipeline routing auth, form, scheduling, and payment events to services.</li>
            <li>Migrated legacy data without loss; automated 15-minute unpaid-call cancellation and prescription templates.</li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="experience-header">
            <a
              className="experience-company"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.github.com/revertinc/revert"
            >
              Revert (now Ampersand)
            </a>
            <span className="experience-date">May 2024 - Aug 2024</span>
          </div>
          <ul className="experience-desc experience-bullets">
            <li>Built Svix-backed webhooks to deliver integration events and keep customer systems in sync.</li>
            <li>Implemented two-way sync across third-party integrations with normalized resources and field mappings.</li>
            <li>Built OAuth flows with authorization, token refresh, and failure handling across integrations.</li>
            <li>Adapted an isomorphic JavaScript SDK for React, Vue, Angular, and customer workflows.</li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="experience-header">
            <a
              className="experience-company"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Nabhag8848?tab=overview&from=2023-12-01&to=2023-12-31&org=RocketChat"
            >
              Rocket.Chat (contributor)
            </a>
            <span className="experience-date">Sep 2023 - May 2024</span>
          </div>
          <ul className="experience-desc experience-bullets">
            <li>Mentored the GSoC 2024 AI GIF Generator and led Rocket.Chat Apps framework workshops.</li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="experience-header">
            <a
              className="experience-company"
              target="_blank"
              rel="noopener noreferrer"
              href="https://summerofcode.withgoogle.com/archive/2023/projects/9v76k7Q8"
            >
              Google Summer of Code
            </a>
            <span className="experience-date">May 2023 - Aug 2023</span>
          </div>
          <ul className="experience-desc experience-bullets">
            <li>
              Built a Notion integration for product managers to manage pages, tasks, and comments in Rocket.Chat, helping the company close more sales deals.{" "}
              <a className="green-link" href="https://www.youtube.com/watch?v=G1fZBqy5jp8" target="_blank" rel="noopener noreferrer">Demo</a>
              {" · "}
              <a className="green-link" href="https://www.figma.com/file/1Tk99mGHBmbQpOiT3vP17i/NotionApp" target="_blank" rel="noopener noreferrer">Design</a>
            </li>
            <li>Built backward-compatible Notion OAuth2 flows for connecting and switching between multiple Notion workspaces on a platform serving <span className="green-highlight">12 million users</span>.</li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="experience-header">
            <a
              className="experience-company"
              target="_blank"
              rel="noopener noreferrer"
              href="https://neev.finance/"
            >
              Neev.Finance
            </a>
            <span className="experience-date">May 2022 - Jun 2022</span>
          </div>
          <ul className="experience-desc experience-bullets">
            <li>Built a market data pipeline delivering crypto-derivative spreads from <span className="green-highlight">4 exchanges in under 100ms</span>.</li>
            <li>Merged concurrent bid/ask streams with RxJS, pushing updates to clients via SSE.</li>
          </ul>
        </div>
      </div>

      <Work activeFilter={activeFilter} onFilterChange={handleFilterChange} />
    </div>
  );
}
export default MiddleColumn;
