import { useEffect } from "react";

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 1000,
  scrollElement = null,
}) => {
  useEffect(() => {
    const el = scrollElement || window;

    const handleScroll = () => {
      if (!hasMore || isLoading) return;

      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        if (scrollTop + clientHeight >= scrollHeight - threshold) {
          onLoadMore();
        }
      } else {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - threshold
        ) {
          onLoadMore();
        }
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, onLoadMore, threshold, scrollElement]);
};
