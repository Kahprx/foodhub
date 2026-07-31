import express from "express";
import seoRoutes from "./seo.route.js";

const router = express.Router();

router.use("/", seoRoutes);

export default router;
