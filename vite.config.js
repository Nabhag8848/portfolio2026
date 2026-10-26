import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { profileRedirects } from "./src/data/profiles.js";

function profileRedirectPlugin() {
  const destinations = new Map(
    profileRedirects.flatMap(({ path, to }) => [
      [path, to],
      [`${path}/`, to],
    ]),
  );

  const redirect = (req, res, next) => {
    const pathname = req.url?.split("?")[0];
    const destination = destinations.get(pathname);
    if (!destination) {
      next();
      return;
    }

    res.writeHead(307, { Location: destination });
    res.end();
  };

  return {
    name: "profile-redirects",
    configureServer(server) {
      server.middlewares.use(redirect);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}

export default defineConfig({
  plugins: [profileRedirectPlugin(), react()],
  build: {
    outDir: "dist",
  },
});
