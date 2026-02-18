import "./App.css";
import LeftColumn from "./columns/Left";
import RightColumn from "./columns/Right";
import MiddleColumn from "./columns/Middle";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isSubPage =
    location.pathname === "/contributions" ||
    location.pathname === "/resume" ||
    location.pathname.startsWith("/blog/") ||
    location.pathname.startsWith("/projects/");

  return (
    <div className="container">
      <div className="left-stack">
        <div className="column left">
          <LeftColumn />
        </div>

        <div className={`column middle ${isSubPage ? "hide-on-mobile" : ""}`}>
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
