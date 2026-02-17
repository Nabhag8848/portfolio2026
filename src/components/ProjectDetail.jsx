import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../data/Projects";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  if (!project) return <div style={{ padding: 24 }}>Project not found.</div>;

  const ProjectComponent = project.component;

  return (
    <div className="right-column-scroll-container">
      <ProjectComponent
        project={project}
        onBack={() => navigate(-1)}
      />
    </div>
  );
}
