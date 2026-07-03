import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());
//API VERSION

app.use("/api/v1", routes);

export default app;