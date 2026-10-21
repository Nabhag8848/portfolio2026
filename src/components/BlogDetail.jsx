import { useNavigate, useParams } from "react-router-dom";
import { buildNotes } from "../data/Projects";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = buildNotes.find((note) => note.id === id);

  if (!project) return <div style={{ padding: 24 }}>Build note not found.</div>;

  const ProjectComponent = project.component;
  const buildNote = { ...project, title: project.buildHeadline };

  return (
    <div className="right-column-scroll-container build-note-detail">
      <ProjectComponent project={buildNote} onBack={() => navigate("/")} />
    </div>
  );
}
