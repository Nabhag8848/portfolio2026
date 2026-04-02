import { useEffect, useState } from "react";
import Work from "../components/Work";
import { useNavigate, useLocation, Link } from "react-router-dom";

function MiddleColumn() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const location = useLocation();

  useEffect(() => {
    const m = location.pathname.match(
      /^\/c\/(integrations|extensions|tools|templates)$/
    );
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
        I began my career as a founding engineer at an integration startup, and
        later as the first engineer at a healthcare company—helped the product
        scale and grew the business past $1M ARR. Now my focus is shifted from
        connecting tools to applied AI systems, context engineering, multi-agent
        orchestration, and language user interfaces. I'm deeply interested in how
        agents can automate complex workflows and reduce operational overhead.
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
            <Link
              className="experience-company"
              to="/blog/sabbatical"
            >
              Health & Wellbeing
            </Link>
            <span className="experience-date">Jun 2025 – Nov 2025</span>
          </div>
          <p className="experience-desc">
            Prioritized recovery from severe Vitamin D3 and B12 deficiencies.
            Documented the full journey in a detailed blog —{" "}
            <Link
              className="green-link"
              to="/blog/sabbatical"
            >
              read it here
            </Link>
            .
          </p>
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
          <p className="experience-desc">
            Sole engineer behind building entire system powering{" "}
            <span className="green-highlight">160K+ therapy sessions</span> and{" "}
            <span className="green-highlight">50K+ users</span> generates{" "}
            <span className="green-highlight">$1M+ arr</span>. Built
            event-driven system integrating Typeform, Calendly, and Razorpay;
            migrated messy legacy data via custom scripts; developed operation{" "}
            <span className="green-highlight">RBAC</span> web app; and automated
            key workflows for seamless operations.{" "}
            <a
              className="green-link"
              href="https://dbdiagram.io/d/Prisma-Generated-66f4e6c53430cb846ca92ea6"
              target="_blank"
              rel="noopener noreferrer"
            >
              db-schema-design
            </a>{" "}
            (for reference).
          </p>
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
          <p className="experience-desc">
            Played a key role in building the new client-side, managing
            production, and leading a full app migration. Contributed to internal
            CRM SDKs and customized isomorphic JavaScript client SDKs for
            customer needs. Set up the foundation for a{" "}
            <span className="green-highlight">webhook system</span> and
            maintained the codebase during critical periods. Conducted
            integration code reviews to ensure product stability.
          </p>
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
            <span className="experience-date">Sep 2022 - May 2024</span>
          </div>
          <p className="experience-desc">
            Contributed to GitHub integration and resolved critical bugs in
            Rocket.Chat. Authored a backward-compatible OAuth2 authorization
            approach for RocketChat.Apps,{" "}
            <span className="green-highlight">Maintainer</span> of the Notion
            Integration, and actively supported new contributors through weekly
            Apps Engine workshops.
          </p>
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
          <p className="experience-desc">
            Built Notion App for Rocket.Chat, enabling seamless collaboration by
            allowing users to create, share, and interact with Notion pages and
            databases directly within Rocket.Chat. Implemented OAuth2
            authorization, multi-workspace support, message preservation, and
            in-chat Notion tables viewing — all with a user-centric and
            backward-compatible approach.
          </p>
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
          <p className="experience-desc">
            Developed a real-time crypto analytics dashboard using WebSockets,
            and NestJS (with Observer pattern). Integrated data feeds from{" "}
            <span className="green-highlight">four major exchanges</span> (FTX,
            OKX, Binance, Huobi Global) and implemented scheduled data storage
            using cron jobs.
          </p>
        </div>
      </div>

      <Work activeFilter={activeFilter} onFilterChange={handleFilterChange} />
    </div>
  );
}
export default MiddleColumn;
