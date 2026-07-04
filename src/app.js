import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/v1", routes);

export default app;