import { Children, useEffect, useId, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import orchexDocumentation from "../data/docs/orchex.md?raw";
import lyoDocumentation from "../data/docs/lyo.md?raw";
import DocumentationCode from "./DocumentationCode";

const documentation = {
  orchex: {
    source: orchexDocumentation,
    base: "https://github.com/Nabhag8848/orchex/blob/main/docs/",
  },
  lyo: {
    source: lyoDocumentation,
    base: "https://github.com/Nabhag8848/lyo-architecture/blob/main/",
  },
};
let diagramQueue = Promise.resolve();

function MermaidDiagram({ children }) {
  const container = useRef(null);
  const id = `diagram-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [width, setWidth] = useState(800);
  const [zoom, setZoom] = useState(1);
  const viewport = useRef(null);
  const source = String(children).trim();
  const label = source.startsWith("sequenceDiagram") ? "Sequence diagram" : source.startsWith("erDiagram") ? "Database schema" : source.startsWith("stateDiagram") ? "State transitions" : "Architecture diagram";

  useEffect(() => {
    let cancelled = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      diagramQueue = diagramQueue.catch(() => {}).then(async () => {
        if (cancelled) return;
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          theme: "base",
          securityLevel: "strict",
          fontFamily: '"Geist Mono", monospace',
          themeVariables: {
            darkMode: true,
            background: "#111713", primaryColor: "#183324", primaryTextColor: "#ecf5ee",
            primaryBorderColor: "#4ade80", secondaryColor: "#1d2c25", tertiaryColor: "#18221c",
            secondaryTextColor: "#d9e7de", tertiaryTextColor: "#d9e7de",
            attributeBackgroundColorOdd: "#17261d", attributeBackgroundColorEven: "#132018",
            rowOdd: "#17261d", rowEven: "#132018", nodeTextColor: "#ecf5ee",
            lineColor: "#86b99a", textColor: "#d9e7de", fontSize: "14px",
            mainBkg: "#183324", nodeBorder: "#4ade80", clusterBkg: "#141e18",
            clusterBorder: "#3c5746", edgeLabelBackground: "#111713",
            actorBkg: "#183324", actorBorder: "#4ade80", actorTextColor: "#ecf5ee",
            actorLineColor: "#5f826c", signalColor: "#86b99a", signalTextColor: "#d9e7de",
            labelBoxBkgColor: "#1d2c25", labelBoxBorderColor: "#4ade80", labelTextColor: "#d9e7de",
            noteBkgColor: "#273124", noteBorderColor: "#889b5c", noteTextColor: "#e7edcc",
            activationBkgColor: "#254a33", activationBorderColor: "#4ade80",
          },
        });
        const result = await mermaid.render(id, source);
        if (!cancelled) {
          const viewBox = result.svg.match(/viewBox="([^"]+)"/)?.[1];
          const naturalWidth = Number(viewBox?.split(/[\s,]+/)[2]);
          if (naturalWidth) setWidth(naturalWidth);
          setSvg(result.svg);
        }
      }).catch(() => {});
    }, { rootMargin: "300px" });
    observer.observe(container.current);
    return () => { cancelled = true; observer.disconnect(); };
  }, [id, source]);

  return (
    <figure ref={container} className="documentation-panel documentation-diagram">
      <figcaption className="documentation-panel-header">
        <span>{label}</span>
        <div className="documentation-panel-actions">
          <button type="button" aria-label="Zoom out diagram" disabled={zoom <= 0.25} onClick={() => setZoom((value) => Math.max(0.25, value - 0.25))}>−</button>
          <span className="documentation-language">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in diagram" disabled={zoom >= 2} onClick={() => setZoom((value) => Math.min(2, value + 0.25))}>+</button>
          <button type="button" onClick={() => setZoom(Math.min(1, (viewport.current.clientWidth - 40) / width))}>Fit</button>
        </div>
      </figcaption>
      <div ref={viewport} className="documentation-diagram-viewport">
        {svg ? <div className="documentation-diagram-svg" style={{ width: width * zoom }} dangerouslySetInnerHTML={{ __html: svg }} /> : <pre><code>{source}</code></pre>}
      </div>
    </figure>
  );
}

function createComponents(docsBase) {
  return {
    p({ children }) {
      const parts = Children.toArray(children);
      const marker = typeof parts[0] === "string" && parts[0].match(/^\[!(IMPORTANT|NOTE|TIP|WARNING|CAUTION)\]\s*/);
      if (!marker) return <p>{children}</p>;
      parts[0] = parts[0].slice(marker[0].length);
      return <p><span className="documentation-callout-label">{marker[1].toLowerCase()}</span>{parts}</p>;
    },
    a({ href, children }) {
      if (href?.startsWith("#")) {
        return <a href={href} onClick={(event) => {
          const heading = document.getElementById(decodeURIComponent(href.slice(1)));
          if (heading) { event.preventDefault(); heading.scrollIntoView({ block: "start" }); }
        }}>{children}</a>;
      }
      const url = href ? new URL(href, docsBase).href : undefined;
      return <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
    pre({ children }) {
      const child = Children.toArray(children)[0];
      const language = child.props.className?.replace("language-", "");
      const source = String(child.props.children).replace(/\n$/, "");
      return language === "mermaid" ? <MermaidDiagram>{source}</MermaidDiagram> : <DocumentationCode language={language} source={source} />;
    },
    code({ className, children }) {
      return <code className={className}>{children}</code>;
    },
    table({ children }) { return <div className="documentation-table"><table>{children}</table></div>; },
  };
}

for (const doc of Object.values(documentation)) {
  doc.components = createComponents(doc.base);
}

export default function ProjectDocumentation({ project }) {
  const doc = documentation[project.id];
  if (!doc) return null;

  return (
    <article className="project-documentation" aria-label={`${project.title} design documentation`}>
      <p><a href={`${doc.base}README.md`} target="_blank" rel="noopener noreferrer">View source documentation ↗</a></p>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={doc.components}>
        {doc.source}
      </Markdown>
    </article>
  );
}
