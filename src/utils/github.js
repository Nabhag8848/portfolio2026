export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getRepoNameFromUrl = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const getRepoOwnerFromUrl = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 2];
};

export const isExternalContribution = (pr) => {
  const owner = getRepoOwnerFromUrl(pr.repository_url);
  return (
    owner.toLowerCase() !== "nabhag8848" && owner.toLowerCase() !== "nabhag9949"
  );
};

export const isAfterCutoffDate = (pr) => {
  const cutoffDate = new Date("2022-08-09T23:59:59Z");
  const prDate = new Date(pr.created_at);
  return prDate > cutoffDate;
};

export const isNotExcludedRepo = (pr) => {
  const owner = getRepoOwnerFromUrl(pr.repository_url);
  const repoName = getRepoNameFromUrl(pr.repository_url);

  const excludedRepos = [{ owner: "twitter-dev", repo: "test" }];

  return !excludedRepos.some(
    (excluded) =>
      owner.toLowerCase() === excluded.owner.toLowerCase() &&
      repoName.toLowerCase() === excluded.repo.toLowerCase()
  );
};

export const isValidContribution = (pr) => {
  return (
    isExternalContribution(pr) && isAfterCutoffDate(pr) && isNotExcludedRepo(pr)
  );
};

export const getStatus = (pr) => {
  if (pr.pull_request.merged_at) return "merged";
  return pr.state;
};

export const fetchGitHubPage = async (page, perPage = 100) => {
  const response = await fetch(
    `https://api.github.com/search/issues?q=author:nabhag8848+is:pr+-user:nabhag9949+is:public&per_page=${perPage}&page=${page}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  const filteredItems = data.items.filter(isValidContribution);

  return {
    ...data,
    items: filteredItems,
    filtered_count: filteredItems.length,
    original_count: data.items.length,
  };
};

export const shouldStopFetching = (currentPage, perPage, data) => {
  const isLastPage = data.original_count < perPage;
  const noMoreItems = data.items.length === 0;
  const reachedGitHubLimit = (currentPage + 1) * perPage >= 1000;

  return isLastPage || noMoreItems || reachedGitHubLimit;
};
