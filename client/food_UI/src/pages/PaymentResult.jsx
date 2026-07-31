import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const provider = searchParams.get("provider") || "VNPay";
  const orderId = searchParams.get("orderId");
  const success = status === "success";

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg rounded-3xl bg-white p-12 text-center shadow-lift ring-1 ring-black/5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-7xl"
        >
          {success ? "🎉" : "😔"}
        </motion.div>

        <h1 className="mt-6 text-4xl font-bold">
          {success ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </h1>

        <p className="mt-4 text-gray-500">
          {success
            ? `Cảm ơn bạn! Giao dịch qua ${provider === "stripe" ? "Stripe" : provider} đã được xác nhận.`
            : "Giao dịch chưa hoàn tất. Vui lòng thử lại hoặc chọn hình thức thanh toán khác."}
        </p>

        {orderId && (
          <div className="mt-8">
            <p className="text-gray-500">Mã đơn hàng</p>
            <h2 className="text-3xl font-bold text-coral">#{orderId.slice(-6).toUpperCase()}</h2>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/orders"
            className="inline-block rounded-2xl bg-teal px-8 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Xem đơn hàng
          </Link>
          <Link
            to="/menu"
            className="inline-block rounded-2xl bg-coral px-8 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default PaymentResult;
