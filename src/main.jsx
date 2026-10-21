import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Analytics />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

const CONTRIBUTION_CACHE_PREFIX = "github-contributions:";
const CACHE_RELOAD_FLAG = "portfolio-cache-reloaded";

const clearContributionCache = () => {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(CONTRIBUTION_CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Storage may be unavailable.
  }
};

const clearCacheStorage = async () => {
  if (!window.caches) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
};

const reloadOnceAfterCacheClear = () => {
  try {
    if (sessionStorage.getItem(CACHE_RELOAD_FLAG)) return;
    sessionStorage.setItem(CACHE_RELOAD_FLAG, "1");
  } catch {
    // If sessionStorage is blocked, still attempt a single reload.
  }
  window.location.reload();
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type !== "PORTFOLIO_CACHE_CLEARED") return;
    clearContributionCache();
    reloadOnceAfterCacheClear();
  });

  window.addEventListener("load", async () => {
    clearContributionCache();

    const registrations = await navigator.serviceWorker.getRegistrations();
    const hadServiceWorker =
      Boolean(navigator.serviceWorker.controller) || registrations.length > 0;

    if (!hadServiceWorker) {
      await clearCacheStorage();
      return;
    }

    // Install the kill-switch worker so it can replace the old caching SW,
    // wipe Cache Storage, unregister, and ask this tab to reload once.
    try {
      await navigator.serviceWorker.register("/sw.js");
    } catch {
      await clearCacheStorage();
      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );
      reloadOnceAfterCacheClear();
    }
  });
} else {
  clearContributionCache();
}
