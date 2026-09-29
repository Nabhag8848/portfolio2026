import { useEffect } from "react";

function getScrollRoot(node) {
  let parent = node.parentElement;
  while (parent && parent !== document.documentElement) {
    const { overflowY } = getComputedStyle(parent);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      parent.scrollHeight > parent.clientHeight + 1
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

export const useInfiniteScroll = ({
  targetRef,
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "800px",
}) => {
  useEffect(() => {
    const target = targetRef?.current;
    if (!target || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { root: getScrollRoot(target), rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, hasMore, isLoading, onLoadMore, rootMargin]);
};
