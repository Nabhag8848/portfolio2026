import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectList from "./ProjectList";
import { projects } from "../data/Projects";

export default function ProjectIndex() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const visible = useMemo(() => {
    // filter by visibility
    let visible = projects.filter((p) => p.clickable === true);
    if (!category) return visible;
    return visible.filter((p) => p.category === category);
  }, [category]);

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
