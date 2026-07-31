import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const DIST = path.join(__dirname, "dist");

const app = express();

app.use(
  createProxyMiddleware({
    pathFilter: "/api",
    target: BACKEND_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      res.status(502).json({ success: false, message: `Backend không khả dụng: ${err.message}` });
    },
  })
);

app.use(express.static(DIST));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  res.sendFile(path.join(DIST, "index.html"));
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Client dang chay o ${PORT}, proxy API -> ${BACKEND_URL}`);
});
