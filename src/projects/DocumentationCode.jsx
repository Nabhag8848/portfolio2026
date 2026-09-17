import { useState } from "react";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";

hljs.registerLanguage("json", json);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("http", () => ({
  contains: [
    { scope: "keyword", begin: /\b(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/ },
    { scope: "string", begin: /\/[^\s]+/ },
    { scope: "number", begin: /\b[1-5]\d{2}\b/ },
    { scope: "attr", begin: /^[\w-]+(?=:)/m },
  ],
}));

export default function DocumentationCode({ language, source }) {
  const [copied, setCopied] = useState(false);
  const isDiagram = !language && /[┌┐└┘│▼►]/.test(source);
  const label = isDiagram ? "Architecture" : language === "http" ? "REST endpoint" : language === "json" ? "JSON payload" : language === "sql" ? "SQL query" : "Code example";
  const highlighted = hljs.getLanguage(language || "")
    ? hljs.highlight(source, { language }).value : null;

  async function copy() {
    try { await navigator.clipboard.writeText(source); setCopied(true); }
    catch { setCopied(false); }
  }

  return (
    <figure className={`documentation-panel ${isDiagram ? "documentation-ascii" : ""}`}>
      <figcaption className="documentation-panel-header">
        <span>{label}</span>
        <div className="documentation-panel-actions">
          <span className="documentation-language">{language && language !== "text" ? language : "text"}</span>
          <button type="button" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`}>{copied ? "Copied" : "Copy"}</button>
        </div>
      </figcaption>
      <pre className="documentation-code">
        {highlighted ? <code dangerouslySetInnerHTML={{ __html: highlighted }} /> : <code>{source}</code>}
      </pre>
    </figure>
  );
}
