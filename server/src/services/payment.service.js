import crypto from "crypto";
import Stripe from "stripe";

const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

export const createVnpayUrl = (orderId, amount, ipAddr, orderInfo = "Thanh toan don hang") => {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  const vnpUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

  if (!tmnCode || !hashSecret) {
    return { error: "VNPAY chưa được cấu hình (VNPAY_TMN_CODE, VNPAY_HASH_SECRET)" };
  }

  const date = new Date();
  const createDate = date.toISOString().slice(0, 10).replace(/-/g, "") + date.toISOString().slice(11, 13) + date.toISOString().slice(14, 16) + date.toISOString().slice(17, 19);
  const txnRef = orderId.toString();

  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo.slice(0, 255),
    vnp_OrderType: "other",
    vnp_Amount: Math.round(amount) * 100,
    vnp_ReturnUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/vnpay/return`,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: createDate,
  };

  const sortedParams = sortObject(params);
  const signData = Object.keys(sortedParams)
    .map((key) => `${key}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, "+")}`)
    .join("&");
  const secureHash = crypto.createHmac("sha512", hashSecret).update(signData).digest("hex");

  return { url: `${vnpUrl}?${signData}&vnp_SecureHash=${secureHash}` };
};

export const verifyVnpayReturn = (query) => {
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  if (!hashSecret) return { valid: false, error: "VNPAY chưa được cấu hình" };

  const secureHash = query.vnp_SecureHash;
  const vnpParams = { ...query };
  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const sortedParams = sortObject(vnpParams);
  const signData = Object.keys(sortedParams)
    .map((key) => `${key}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, "+")}`)
    .join("&");
  const checkHash = crypto.createHmac("sha512", hashSecret).update(signData).digest("hex");

  if (checkHash !== secureHash) return { valid: false, error: "Chữ ký không hợp lệ" };

  return {
    valid: true,
    orderId: vnpParams.vnp_TxnRef,
    amount: vnpParams.vnp_Amount / 100,
    responseCode: vnpParams.vnp_ResponseCode,
    bankCode: vnpParams.vnp_BankCode,
    transactionNo: vnpParams.vnp_TransactionNo,
  };
};

export const createMomoUrl = async (orderId, amount, orderInfo = "Thanh toan don hang") => {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;

  if (!partnerCode || !accessKey || !secretKey) {
    return { error: "MoMo chưa được cấu hình (MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY)" };
  }

  const requestId = `${partnerCode}-${Date.now()}`;
  const redirectUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/momo/return`;
  const ipnUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/momo/ipn`;

  const rawSignature = `accessKey=${accessKey}&amount=${Math.round(amount)}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${encodeURIComponent(orderInfo)}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

  const body = JSON.stringify({
    partnerCode,
    partnerName: "HappyHomes",
    storeId: "HappyHomesStore",
    requestId,
    amount: Math.round(amount),
    orderId: orderId.toString(),
    orderInfo,
    redirectUrl,
    ipnUrl,
    requestType: "captureWallet",
    extraData: "",
    signature,
    lang: "vi",
  });

  const response = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const result = await response.json();
  if (result.resultCode !== 0) {
    return { error: result.message || "Lỗi tạo giao dịch MoMo" };
  }

  return { url: result.payUrl, momoData: result };
};

export const createStripeCheckout = async (orderId, amount, orderInfo = "Thanh toan don hang") => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return { error: "Stripe chưa được cấu hình (STRIPE_SECRET_KEY)" };
  }

  const stripe = new Stripe(secretKey);
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "vnd",
          product_data: { name: orderInfo.slice(0, 100) },
          unit_amount: Math.round(amount),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: orderId.toString() },
    success_url: `${clientUrl}/payment/result?status=success&provider=stripe&orderId=${orderId}`,
    cancel_url: `${clientUrl}/payment/result?status=failed&provider=stripe&orderId=${orderId}`,
  });

  return { url: session.url, sessionId: session.id };
};

export const createStripePaymentIntent = async (amount, orderId) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return { error: "Stripe chưa được cấu hình (STRIPE_SECRET_KEY)" };
  }

  const stripe = new Stripe(secretKey);
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency: "vnd",
    metadata: { orderId: orderId.toString() },
  });

  return { clientSecret: intent.client_secret, amount };
};
