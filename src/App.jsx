import "./App.css";
import LeftColumn from "./columns/Left";
import RightColumn from "./columns/Right";
import MiddleColumn from "./columns/Middle";
import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const OVERLAY_QUERY = "(max-width: 1024px)";

function clearBodyScrollLock() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
}

function App() {
  const location = useLocation();
  const isSubPage =
    location.pathname === "/contributions" ||
    location.pathname === "/resume" ||
    location.pathname.startsWith("/blog/") ||
    location.pathname.startsWith("/projects/");
  const savedScrollY = useRef(0);

  useLayoutEffect(() => {
    const isOverlayViewport = window.matchMedia(OVERLAY_QUERY).matches;
    if (!(isSubPage && isOverlayViewport)) return;

    savedScrollY.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      clearBodyScrollLock();
      window.scrollTo(0, savedScrollY.current);
    };
  }, [isSubPage]);

  return (
    <div className={`container ${isSubPage ? "detail-open" : "detail-closed"}`}>
      <div className="left-stack">
        <div className="column left">
          <LeftColumn />
        </div>

        <div className="column middle">
          <MiddleColumn />
        </div>
      </div>

      <div className="column right">
        <RightColumn />
      </div>
    </div>
  );
}

export default App;
