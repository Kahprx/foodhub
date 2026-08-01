import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import routes from "./routes/index.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import seoRoutes from "./routes/seo.route.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const app = express();

// SPA build từ client/food_UI/dist (khi deploy gộp frontend + backend thành 1 service).
// Nếu chưa build thì bỏ qua phần static, API vẫn hoạt động bình thường.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../../client/food_UI/dist");
const hasClient = existsSync(DIST);

// Railway chạy sau reverse proxy -> tin header X-Forwarded-For để rate limiter hoạt động đúng
app.set("trust proxy", 1);

// Security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // Cho phép ảnh từ bất kỳ https nào (unsplash hotlink + ảnh local /images)
        "img-src": ["'self'", "data:", "https:"],
      },
    },
  })
);

// Compression
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút" },
});

// Middleware
app.use(cors());
app.use("/api/v1/payment/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "2mb" }));

// Request logger (đơn giản, không cần morgan) để debug production
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/v1", apiLimiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1", routes);
app.use("/", seoRoutes);

// Phục vụ SPA (client) ngay trong backend service
if (hasClient) {
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

  // SPA fallback: mọi GET không phải /api trả về index.html (deep-link /menu, /admin, ...)
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(DIST, "index.html"));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route không tồn tại",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Lỗi server",
  });
});

export default app;
