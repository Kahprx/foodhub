import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  exportRevenueReportExcel,
  exportOrdersReportPdf,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/revenue/excel", protect, adminOnly, exportRevenueReportExcel);
router.get("/orders/pdf", protect, adminOnly, exportOrdersReportPdf);

export default router;
