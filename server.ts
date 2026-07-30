import path from "path";
import { createServer as createViteServer } from "vite";
import { createApp } from "./src/api.ts";

const PORT = 3000;

async function startServer() {
  const app = createApp();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Paydra Bank server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
