import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import Order from "../models/Order.js";
import { createVnpayUrl, createMomoUrl, verifyVnpayReturn, createStripeCheckout } from "../services/payment.service.js";

const router = express.Router();

router.post("/vnpay/create", protect, async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const ipAddr = req.ip || req.socket.remoteAddress;
    const result = createVnpayUrl(orderId, amount || order.totalPrice, ipAddr, orderInfo);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    order.paymentMethod = "Banking";
    await order.save();

    return res.status(200).json({ success: true, url: result.url });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/momo/create", protect, async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const result = await createMomoUrl(orderId, amount || order.totalPrice, orderInfo);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    order.paymentMethod = "Momo";
    await order.save();

    return res.status(200).json({ success: true, url: result.url });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/stripe/create", protect, async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const result = await createStripeCheckout(orderId, amount || order.totalPrice, orderInfo);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    order.paymentMethod = "Stripe";
    await order.save();

    return res.status(200).json({ success: true, url: result.url, sessionId: result.sessionId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/stripe/webhook", async (req, res) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return res.status(200).json({ received: true });
  }

  const stripe = new (await import("stripe")).default(secretKey);
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], webhookSecret);
  } catch {
    return res.status(400).json({ success: false, message: "Webhook signature invalid" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
        paymentInfo: {
          method: "Stripe",
          sessionId: session.id,
          amount: session.amount_total,
        },
      });
    }
  }

  return res.status(200).json({ received: true });
});

router.get("/vnpay/return", async (req, res) => {
  const result = verifyVnpayReturn(req.query);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.error });
  }

  if (result.responseCode === "00") {
    await Order.findByIdAndUpdate(result.orderId, {
      paymentStatus: "Paid",
      paymentInfo: {
        method: "VNPay",
        transactionNo: result.transactionNo,
        bankCode: result.bankCode,
      },
    });
  }

  return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/payment/result?status=${result.responseCode === "00" ? "success" : "failed"}`);
});

export default router;
