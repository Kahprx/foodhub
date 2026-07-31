import {
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  cancelOrderService,
  getRevenueService,
  getAllOrdersService,
  getRevenueChartService,
  getOrderStatusService,
  getRecentOrdersService,
  calculateCouponDiscount,
} from "../services/order.service.js";
import Order from "../models/Order.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, couponCode, shippingFee, shippingProvider } = req.body;
    const order = await createOrderService(
      req.user.id,
      deliveryAddress,
      paymentMethod,
      { couponCode, shippingFee, shippingProvider }
    );
    return res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateShipping = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, eta, shipmentStatus, shippingProvider } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (shippingProvider !== undefined) order.shippingProvider = shippingProvider;
    if (trackingNumber !== undefined) order.trackingNumber = String(trackingNumber);
    if (shipmentStatus !== undefined) order.shipmentStatus = String(shipmentStatus);
    if (eta !== undefined) order.eta = eta ? new Date(eta) : null;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật vận chuyển thành công",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const checkCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const subtotal = req.body?.subtotal ?? req.query?.subtotal;
    const result = await calculateCouponDiscount(Number(subtotal) || 0, code);
    return res.status(200).json({
      success: true,
      data: {
        code,
        discount: result.discount,
        coupon: result.coupon,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const order = await getMyOrdersService(req.user.id);
    return res.status(200).json({
      success: true,
      count: order.length,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Người dùng thường chỉ xem được đơn của mình, trừ admin
    if (req.user.role !== "admin" && order.user?._id?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await updateOrderStatusService(id, status, req.user.id, note);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "không tìm thấy đơn hàng ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await cancelOrderService(id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRevenue = async (req, res) => {
  try {
    const revenue = await getRevenueService();

    return res.status(200).json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const result = await getAllOrdersService(req.query);

    return res.status(200).json({
      success: true,
      count: result.orders.length,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
      data: result.orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const data = await getRevenueChartService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const data = await getOrderStatusService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await getRecentOrdersService();
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const exportOrdersExcel = async (req, res) => {
  try {
    const { orders } = await getAllOrdersService({ limit: 1000 });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "HappyHomes";
    const sheet = workbook.addWorksheet("DonHang");

    sheet.columns = [
      { header: "Mã đơn", key: "id", width: 14 },
      { header: "Khách hàng", key: "customer", width: 24 },
      { header: "Email", key: "email", width: 28 },
      { header: "Cửa hàng", key: "restaurant", width: 20 },
      { header: "Sản phẩm", key: "items", width: 40 },
      { header: "Tổng tiền", key: "total", width: 14 },
      { header: "Trạng thái", key: "status", width: 14 },
      { header: "Thanh toán", key: "payment", width: 12 },
      { header: "Ngày đặt", key: "date", width: 20 },
    ];

    orders.forEach((o) => {
      sheet.addRow({
        id: `#${o._id.toString().slice(-6)}`,
        customer: o.user?.fullName || "",
        email: o.user?.email || "",
        restaurant: o.restaurant?.name || "",
        items: o.items.map((i) => `${i.food?.name || "?"} x${i.quantity}`).join(", "),
        total: o.totalPrice,
        status: o.status,
        payment: o.paymentMethod,
        date: o.createdAt?.toISOString().slice(0, 16).replace("T", " "),
      });
    });

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3C8" },
    };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=orders-${Date.now()}.xlsx`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const exportOrderPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=order-${order._id.toString().slice(-6)}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).fillColor("#111827").text("HÓA ĐƠN ĐƠN HÀNG", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).fillColor("#6b7280").text("HappyHomes - Cửa hàng đồ chơi", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(12).fillColor("#111827");
    doc.text(`Mã đơn: #${order._id.toString().slice(-6)}`);
    doc.text(`Khách hàng: ${order.user?.fullName || ""}`);
    doc.text(`Email: ${order.user?.email || ""}`);
    doc.text(`Địa chỉ: ${order.deliveryAddress}`);
    doc.text(`Phương thức: ${order.paymentMethod}`);
    doc.text(`Ngày đặt: ${order.createdAt?.toLocaleString("vi-VN") || ""}`);
    doc.moveDown();

    doc.fontSize(11).fillColor("#f97316").text("Sản phẩm");
    doc.moveDown(0.3);

    const startY = doc.y;
    doc.fontSize(9).fillColor("#374151");
    doc.text("Tên sản phẩm", 50, startY);
    doc.text("SL", 350, startY);
    doc.text("Giá", 420, startY, { width: 80, align: "right" });

    doc.moveDown(0.5);
    order.items.forEach((item) => {
      doc.text(item.food?.name || "Sản phẩm", 50);
      doc.text(String(item.quantity), 350, doc.y - 12, { width: 30 });
      doc.text((item.price * item.quantity).toLocaleString("vi-VN") + "đ", 420, doc.y - 12, {
        width: 80,
        align: "right",
      });
      doc.moveDown(0.4);
    });

    doc.moveDown(1);
    doc.fontSize(11).fillColor("#111827");
    doc.text(`Tạm tính: ${(order.subtotal || 0).toLocaleString("vi-VN")}đ`, { align: "right" });
    doc.text(`Phí ship: ${(order.shippingFee || 0).toLocaleString("vi-VN")}đ`, { align: "right" });
    if (order.discountAmount) {
      doc.text(`Giảm giá: -${order.discountAmount.toLocaleString("vi-VN")}đ`, { align: "right" });
    }
    doc.moveDown(0.3);
    doc.fontSize(14).text(`Tổng cộng: ${order.totalPrice.toLocaleString("vi-VN")}đ`, {
      align: "right",
    });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("#9ca3af").text("Cảm ơn bạn đã mua sắm tại HappyHomes!", { align: "center" });

    doc.end();
  } catch (error) {
    if (res.headersSent) return;
    return res.status(500).json({ success: false, message: error.message });
  }
};
