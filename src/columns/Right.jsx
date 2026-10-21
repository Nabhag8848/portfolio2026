import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProjectDetail from "../components/ProjectDetail";
import BlogDetail from "../components/BlogDetail";
import Sabbatical from "../pages/Sabbatical";
import Contributions from "../pages/Contributions";
import Resume from "../pages/Resume";

function RightColumn() {
  const location = useLocation();
  const isOpen = location.pathname !== "/";

  return (
    <div
      key={location.pathname}
      className={isOpen ? "right-panel right-panel-enter" : "right-panel"}
    >
      <Routes>
        <Route path="/" element={null} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/c/:category" element={<Navigate to="/" replace />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/blog/sabbatical" element={<Sabbatical />} />
        <Route path="/contributions" element={<Contributions />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default RightColumn;
