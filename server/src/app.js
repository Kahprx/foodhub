import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import dashboardRoutes from "./routes/dashboard.route.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/v1", routes);
app.use("/api/v1/dashboard", dashboardRoutes);  

export default app;