import { Children, useEffect, useId, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import orchexDocumentation from "../data/docs/orchex.md?raw";
import lyoDocumentation from "../data/docs/lyo.md?raw";
import DocumentationCode from "./DocumentationCode";
import readmeMetadata from "../data/docs/readmes/metadata.json";
import videoAttachments from "../data/docs/readmes/videos.json";
import assetTypes from "../data/docs/readmes/assets.json";

const videoUrls = new Set(videoAttachments);
const isVideoUrl = (url) => assetTypes[url]?.startsWith("video/") || videoUrls.has(url) || /\.(mp4|webm|mov|m4v|ogv)(?:[?#]|$)/i.test(url || "");

function MarkdownImage({ src, alt, title, width, height }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <a href={src} target="_blank" rel="noopener noreferrer">Open image attachment ↗</a>;
  return <img src={src} alt={alt || "Project attachment"} title={title} width={width} height={height} loading="lazy" decoding="async" onError={() => setFailed(true)} style={{ maxWidth: "100%", height: "auto" }} />;
}

function removePreviewDuplicates({ previewSrc }) {
  return (tree) => {
    if (!previewSrc) return;
    const preview = new URL(previewSrc, "https://portfolio.local");
    const stem = (path) => path.split("/").pop()?.replace(/\.(gif|mp4|webm|mov|m4v)$/i, "");
    const matchesPreview = (src) => {
      if (typeof src !== "string") return false;
      const url = new URL(src, "https://portfolio.local");
      if (url.origin === preview.origin && url.pathname === preview.pathname) return true;
      // Locally compressed GIF previews retain the original recording's name.
      return preview.origin === "https://portfolio.local" &&
        /\.(gif|mp4|webm|mov|m4v)$/i.test(url.pathname) &&
        stem(url.pathname) === stem(preview.pathname);
    };
    const containsPreviewSource = (node) => node.children?.some((child) =>
      child.tagName === "source" && matchesPreview(child.properties?.src));
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.filter((child) => {
        if (child.type !== "element") return true;
        if (child.tagName === "a" && matchesPreview(child.properties?.href)) return false;
        if (["video", "img"].includes(child.tagName) &&
          (matchesPreview(child.properties?.src) || containsPreviewSource(child))) return false;
        visit(child);
        return child.tagName !== "p" || child.children.some((part) =>
          part.type !== "text" || part.value.trim());
      });
    };
    visit(tree);
  };
}
const markdownSchema = {
  ...defaultSchema,
  tagNames: [...defaultSchema.tagNames, "video", "source"],
  attributes: {
    ...defaultSchema.attributes,
    video: ["src", "poster", "controls", "playsInline", "preload"],
    source: ["src", "type"],
  },
};

function MarkdownVideo({ src, poster, children }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="documentation-video">
      {!failed && <video src={src} poster={poster} controls playsInline preload="metadata" onError={() => setFailed(true)}>{children}</video>}
      {src && <a href={src} target="_blank" rel="noopener noreferrer">{failed ? "Open video attachment (inline playback unavailable)" : "Open video attachment"} ↗</a>}
    </span>
  );
}

const readmeLoaders = import.meta.glob("../data/docs/readmes/*.md", {
  query: "?raw",
  import: "default",
});

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
  const [zoom, setZoom] = useState(1);
  const source = String(children).trim();
  const isSchema = /^erDiagram\b/.test(source);
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
          flowchart: { rankSpacing: 24, nodeSpacing: 24, padding: 10 },
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
        // Validate first so Mermaid 12 never injects its parser error into the
        // document. Invalid diagrams stay as the source preview below.
        const isValid = await mermaid.parse(source, { suppressErrors: true });
        if (!isValid || cancelled) return;
        const result = await mermaid.render(id, source);
        if (!cancelled) {
          // Preserve intrinsic dimensions: a narrow vertical flowchart should
          // not be enlarged to the full width of the documentation column.
          // Mermaid's HTML labels can contain <br> elements, which are valid
          // HTML but not well-formed XML. Use the same parser as the page.
          const document = new DOMParser().parseFromString(result.svg, "text/html");
          const renderedSvg = document.querySelector("svg");
          if (!renderedSvg) return;
          const viewBox = renderedSvg.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
          if (viewBox?.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
            renderedSvg.setAttribute("width", String(viewBox[2]));
            renderedSvg.setAttribute("height", String(viewBox[3]));
          }
          setSvg(renderedSvg.outerHTML);
        }
      }).catch(() => {
        // A documentation diagram is optional; ignore Mermaid syntax errors.
        // The source remains visible in the fallback <pre> below.
      });
    }, { rootMargin: "300px" });
    observer.observe(container.current);
    return () => { cancelled = true; observer.disconnect(); };
  }, [id, source]);

  return (
    <figure ref={container} className={`documentation-panel documentation-diagram${isSchema ? " documentation-schema" : ""}`}>
      <figcaption className="documentation-panel-header">
        <span>{label}</span>
        {isSchema && (
          <div className="documentation-panel-actions">
            <button type="button" aria-label="Zoom out database schema" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - 0.5))}>−</button>
            <span className="documentation-language">{Math.round(zoom * 100)}%</span>
            <button type="button" aria-label="Zoom in database schema" disabled={zoom >= 4} onClick={() => setZoom((value) => Math.min(4, value + 0.5))}>+</button>
            <button type="button" onClick={() => setZoom(1)}>Fit</button>
          </div>
        )}
      </figcaption>
      <div className={`documentation-diagram-viewport${isSchema && zoom > 1 ? " documentation-schema-zoomed" : ""}`}>
        {svg ? <div className="documentation-diagram-svg" style={isSchema ? { width: `${zoom * 100}%` } : undefined} dangerouslySetInnerHTML={{ __html: svg }} /> : <pre><code>{source}</code></pre>}
      </div>
    </figure>
  );
}

function createComponents(docsBase, rawBase = docsBase.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")) {
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
      if (isVideoUrl(href)) return <MarkdownVideo src={new URL(href, rawBase).href} />;
      if (assetTypes[href]?.startsWith("image/") && Children.toArray(children).every((child) => typeof child === "string")) {
        return <MarkdownImage src={href} />;
      }
      const url = href ? new URL(href, docsBase).href : undefined;
      return <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
    img({ src, alt, title, width, height }) {
      const url = src ? new URL(src, rawBase).href : undefined;
      if (isVideoUrl(src)) return <MarkdownVideo src={url} />;
      // Older READMEs sometimes embed HTTP thumbnails, blocked on HTTPS sites.
      const secureUrl = url?.startsWith("http://img.youtube.com/") ? url.replace("http:", "https:") : url;
      return <MarkdownImage src={secureUrl} alt={alt} title={title} width={width} height={height} />;
    },
    video({ src, poster, children }) {
      return <MarkdownVideo src={src ? new URL(src, rawBase).href : undefined} poster={poster ? new URL(poster, rawBase).href : undefined}>{children}</MarkdownVideo>;
    },
    source({ src, type }) {
      return <source src={src ? new URL(src, rawBase).href : undefined} type={type} />;
    },
    pre({ children }) {
      const child = Children.toArray(children)[0];
      const language = child?.props?.className?.replace("language-", "");
      const source = String(child?.props?.children ?? child ?? "").replace(/\n$/, "");
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
  const [readme, setReadme] = useState(null);
  const bundledDoc = documentation[project.id];
  const metadata = readmeMetadata[project.id];

  useEffect(() => {
    let cancelled = false;
    setReadme(null);
    const load = readmeLoaders[`../data/docs/readmes/${project.id}.md`];
    if (load && metadata) {
      load().then((source) => {
        if (!cancelled) setReadme({
          source,
          base: metadata.base,
          sourceUrl: metadata.sourceUrl,
          components: createComponents(metadata.base, metadata.rawBase),
        });
      }).catch(() => {});
    }
    return () => { cancelled = true; };
  }, [project.id, metadata]);

  const doc = bundledDoc || readme;
  if (!doc && metadata) return <p style={{ padding: "30px" }}>Loading README…</p>;
  if (!doc) return null;

  return (
    <article className="project-documentation" aria-label={`${project.title} ${bundledDoc ? "design documentation" : "README"}`}>
      <p><a href={doc.sourceUrl || `${doc.base}README.md`} target="_blank" rel="noopener noreferrer">{bundledDoc ? "View source documentation" : "View README on GitHub"} ↗</a></p>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema], [removePreviewDuplicates, { previewSrc: project.src }], rehypeSlug]} components={doc.components}>
        {doc.source}
      </Markdown>
    </article>
  );
}
