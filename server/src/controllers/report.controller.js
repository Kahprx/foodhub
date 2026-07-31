import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import User from "../models/User.js";

export const exportRevenueReportExcel = async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - (Number(req.query.days) || 30));

    const completed = await Order.find({
      status: "Completed",
      createdAt: { $gte: since },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "HappyHomes";
    const sheet = workbook.addWorksheet("BaoCaoDoanhThu");

    sheet.columns = [
      { header: "Ngày", key: "date", width: 16 },
      { header: "Số đơn", key: "orders", width: 12 },
      { header: "Doanh thu", key: "revenue", width: 16 },
    ];

    const byDate = {};
    completed.forEach((o) => {
      const key = o.createdAt.toISOString().slice(0, 10);
      byDate[key] = byDate[key] || { orders: 0, revenue: 0 };
      byDate[key].orders += 1;
      byDate[key].revenue += o.totalPrice;
    });

    Object.entries(byDate)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .forEach(([date, val]) => {
        sheet.addRow({ date, orders: val.orders, revenue: val.revenue });
      });

    const totalRevenue = completed.reduce((s, o) => s + o.totalPrice, 0);
    sheet.addRow({ date: "TỔNG", orders: completed.length, revenue: totalRevenue });

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3C8" } };

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=revenue-report-${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const exportOrdersReportPdf = async (req, res) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, completedOrders, cancelledOrders, users, foods] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: "Completed" } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        Order.countDocuments({ status: "Pending" }),
        Order.countDocuments({ status: "Completed" }),
        Order.countDocuments({ status: "Cancelled" }),
        User.countDocuments({ isDeleted: { $ne: true } }),
        Food.countDocuments(),
      ]);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=orders-report-${Date.now()}.pdf`);
    doc.pipe(res);

    doc.fontSize(22).fillColor("#111827").text("BÁO CÁO TỔNG QUAN", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).fillColor("#6b7280").text(`HappyHomes - Xuất ngày ${new Date().toLocaleDateString("vi-VN")}`, { align: "center" });
    doc.moveDown(2);

    const metrics = [
      ["Tổng đơn hàng", totalOrders],
      ["Doanh thu (đã hoàn thành)", (totalRevenue[0]?.total || 0).toLocaleString("vi-VN") + "đ"],
      ["Đơn đang chờ", pendingOrders],
      ["Đơn hoàn thành", completedOrders],
      ["Đơn đã hủy", cancelledOrders],
      ["Số người dùng", users],
      ["Số sản phẩm", foods],
    ];

    metrics.forEach(([label, value]) => {
      doc
        .fontSize(12)
        .fillColor("#374151")
        .text(label, 50)
        .fontSize(12)
        .fillColor("#f97316")
        .text(String(value), 400, doc.y - 16, { width: 150, align: "right" });
      doc.moveDown(0.6);
    });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("#9ca3af").text("Báo cáo được tạo tự động bởi HappyHomes Admin", { align: "center" });

    doc.end();
  } catch (error) {
    if (res.headersSent) return;
    return res.status(500).json({ success: false, message: error.message });
  }
};
