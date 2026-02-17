import { Link } from "react-router-dom";
import {
  formatDate,
  getRepoNameFromUrl,
  getRepoOwnerFromUrl,
  getStatus,
} from "../utils/github";
import { useContributions } from "../hooks/useContributions";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

function PRItem({ pr }) {
  const status = getStatus(pr);

  const statusClass =
    status === "merged"
      ? "contrib-status-merged"
      : status === "closed"
      ? "contrib-status-closed"
      : "contrib-status-open";

  return (
    <div className="contrib-pr-card">
      <div className="contrib-repo-name">
        {getRepoOwnerFromUrl(pr.repository_url)}/
        {getRepoNameFromUrl(pr.repository_url)}
      </div>
      <div className="contrib-pr-header">
        <a
          className="contrib-pr-title"
          href={pr.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {pr.title}
        </a>
        <div className="contrib-pr-meta">
          <span className="contrib-date">
            {pr.pull_request.merged_at
              ? formatDate(pr.pull_request.merged_at)
              : pr.closed_at
              ? formatDate(pr.closed_at)
              : formatDate(pr.created_at)}
          </span>
          <span className={`contrib-status ${statusClass}`}>{status}</span>
        </div>
      </div>
      {pr.labels.length > 0 && (
        <div className="contrib-labels">
          {pr.labels.map((label) => (
            <span key={label.name} className="contrib-label">
              {label.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Contributions() {
  const { prs, loading, loadingMore, error, hasMore, loadMore } =
    useContributions();

  useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: loadMore,
    threshold: 1000,
  });

  if (loading) {
    return (
      <div className="contrib-container">
        <Link to="/" className="blog-back-link">
          ← Back
        </Link>
        <h1 className="contrib-header">Opensource contributions</h1>
        <h2 className="contrib-subheader">Pull Requests</h2>
        <div className="contrib-loading">
          <span className="contrib-spinner">⚙️</span>
        </div>
      </div>
    );
  }

  if (error && prs.length === 0) {
    return (
      <div className="contrib-container">
        <Link to="/" className="blog-back-link">
          ← Back
        </Link>
        <h1 className="contrib-header">Opensource contributions</h1>
        <div className="contrib-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="contrib-container">
      <Link to="/" className="blog-back-link">
        ← Back
      </Link>
      <h1 className="contrib-header">Opensource contributions</h1>
      <h2 className="contrib-subheader">Pull Requests</h2>
      <main>
        {prs.map((pr) => (
          <PRItem key={pr.html_url} pr={pr} />
        ))}

        {loadingMore && (
          <div className="contrib-loading-more">
            <div className="contrib-loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {!hasMore && prs.length > 0 && (
          <div className="contrib-end">You've reached the end!</div>
        )}

        {!hasMore && prs.length === 0 && (
          <div className="contrib-end">
            No external contributions found. All PRs might be from your own
            repositories.
          </div>
        )}

        {error && prs.length > 0 && (
          <div className="contrib-error">Error loading more: {error}</div>
        )}
      </main>
    </div>
  );
}
