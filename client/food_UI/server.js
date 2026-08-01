import express from "express";
import compression from "compression";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const DIST = path.join(__dirname, "dist");

const agent = BACKEND_URL.startsWith("https")
  ? new https.Agent({ keepAlive: true, maxSockets: 16, timeout: 30000 })
  : new http.Agent({ keepAlive: true, maxSockets: 16, timeout: 30000 });

const app = express();

app.set("trust proxy", 1);

app.use(compression());

app.use(
  createProxyMiddleware({
    pathFilter: "/api",
    target: BACKEND_URL,
    changeOrigin: true,
    agent,
    timeout: 45000,
    proxyTimeout: 45000,
    onError: (err, req, res) => {
      const status = err.code === "ETIMEDOUT" ? 504 : 502;
      res.status(status).json({
        success: false,
        message: `Backend không phản hồi (${err.code || err.message}). Vui lòng thử lại sau giây lát.`,
      });
    },
  })
);

app.use(
  express.static(DIST, {
    maxAge: "1y",
    immutable: true,
    index: "index.html",
    setHeaders(res, filePath) {
      if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(DIST, "index.html"));
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Client dang chay o ${PORT}, proxy API -> ${BACKEND_URL}`);
});
