import { projects as allProjects } from "../data/Projects";
import ProjectCard from "./ProjectCard";

function ProjectList({ onSelect, projects }) {
  const items = projects ?? allProjects;
  return (
    <div>
      {items.map((project) => (
        <div key={project.id}>
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onSelect(project)}
          />
          <div className="divider" />
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
