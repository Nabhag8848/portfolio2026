import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProjectList from "./ProjectList";
import { featuredProjects } from "../data/Projects";

export default function ProjectIndex() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const visible = useMemo(
    () => featuredProjects.filter((project) => project.clickable),
    [],
  );

  return (
    <div
      className={`project-page-wrapper ${isVisible ? "fade-in" : "fade-out"}`}
    >
      <ProjectList
        projects={visible}
        onSelect={(p) => navigate(`/projects/${p.id}`)}
      />
    </div>
  );
}
