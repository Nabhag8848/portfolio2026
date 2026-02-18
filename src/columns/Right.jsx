import { Routes, Route, Navigate } from "react-router-dom";
import ProjectIndex from "../components/ProjectIndex";
import ProjectDetail from "../components/ProjectDetail";
import Sabbatical from "../pages/Sabbatical";
import Contributions from "../pages/Contributions";
import Resume from "../pages/Resume";

function RightColumn() {
  return (
    <Routes>
      <Route path="/" element={<ProjectIndex />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/c/:category" element={<ProjectIndex />} />
      <Route path="/blog/sabbatical" element={<Sabbatical />} />
      <Route path="/contributions" element={<Contributions />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default RightColumn;
