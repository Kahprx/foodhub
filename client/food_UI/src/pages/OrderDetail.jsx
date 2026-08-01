import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaChevronLeft,
} from "react-icons/fa";

const statusSteps = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Delivering",
  "Completed",
];

const statusLabels = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Preparing: "Đang chuẩn bị",
  Delivering: "Đang giao",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
};

const providerLabels = {
  SPX: "SPX Express",
  GHN: "Giao Hàng Nhanh",
  ViettelPost: "Viettel Post",
};

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const [cancelling, setCancelling] = useState(false);

  const cancelOrder = async () => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    setCancelling(true);
    try {
      const response = await api.put(`/orders/${id}/cancel`);
      setOrder(response.data.data);
      toast.success("Đã hủy đơn hàng.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể hủy đơn hàng.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-coral border-t-transparent" />
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="container mx-auto px-6 pt-28 pb-24 text-center">
        <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
        <p className="mt-5 text-red-500">{error || "Không tìm thấy đơn hàng."}</p>
        <Link to="/orders" className="mt-6 inline-block font-semibold text-coral">
          <FaChevronLeft className="mr-1 inline" /> Quay lại đơn hàng
        </Link>
      </section>
    );
  }

  const isCancelled = order.status === "Cancelled";
  const currentIndex = isCancelled ? -1 : statusSteps.indexOf(order.status);
  const isCompleted = order.status === "Completed";

  return (
    <section className="container mx-auto min-h-screen px-6 pb-24 pt-28">
      <Link to="/orders" className="mb-6 inline-flex items-center gap-2 font-semibold text-gray-500 transition hover:text-coral">
        <FaChevronLeft /> Quay lại đơn hàng của tôi
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold">
            Đơn hàng #{order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="mt-2 text-gray-500">
            Đặt ngày {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
            isCancelled
              ? "bg-red-100 text-red-700"
              : isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
          }`}>
            {statusLabels[order.status] || order.status}
          </span>
          {!isCancelled && !isCompleted && ["Pending", "Confirmed", "Preparing"].includes(order.status) && (
            <button
              type="button"
              onClick={cancelOrder}
              disabled={cancelling}
              className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-40"
            >
              {cancelling ? "Đang hủy..." : "Hủy đơn"}
            </button>
          )}
        </div>
      </div>

      {/* Tracking timeline */}
      {isCancelled ? (
        <div className="mb-8 flex items-center gap-4 rounded-3xl bg-red-50 p-6">
          <FaTimesCircle className="text-3xl text-red-500" />
          <div>
            <p className="text-lg font-bold text-red-700">Đơn hàng đã bị hủy</p>
            <p className="text-sm text-red-600">
              {order.statusHistory?.find((h) => h.status === "Cancelled")?.note || "Đơn hàng đã bị hủy bởi người dùng hoặc cửa hàng."}
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:p-8"
        >
          <h2 className="font-display mb-8 text-2xl font-bold">Trạng thái đơn hàng</h2>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="absolute left-5 top-6 hidden h-0.5 w-[calc(100%-40px)] bg-gray-100 sm:block" />
            <div
              className="absolute left-5 top-6 hidden h-0.5 bg-coral transition-all duration-700 sm:block"
              style={{ width: `calc((100% - 40px) * ${Math.max(currentIndex, 0) / (statusSteps.length - 1)})` }}
            />
            {statusSteps.map((step, index) => {
              const done = index <= currentIndex;
              return (
                <div key={step} className="relative z-10 flex items-center gap-3 sm:flex-col sm:gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition ${
                    done ? "bg-coral text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {done ? <FaCheckCircle /> : <FaClipboardList />}
                  </div>
                  <div className="text-left sm:text-center">
                    <p className={`text-sm font-bold ${done ? "text-coral" : "text-gray-400"}`}>{statusLabels[step]}</p>
                    <p className="text-xs text-gray-400">
                      {order.statusHistory?.find((h) => h.status === step)
                        ? new Date(order.statusHistory.find((h) => h.status === step).changedAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {order.shippingProvider && (
            <div className="mt-8 flex flex-col gap-2 rounded-3xl bg-sunny/20 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <FaTruck className="text-2xl text-coral" />
                <div>
                  <p className="font-bold">{providerLabels[order.shippingProvider] || order.shippingProvider}</p>
                  <p className="text-sm text-gray-500">
                    {order.trackingNumber ? `Mã vận đơn: ${order.trackingNumber}` : "Chưa có mã vận đơn"}
                    {order.shipmentStatus ? ` · ${order.shipmentStatus}` : ""}
                  </p>
                </div>
              </div>
              {order.eta && (
                <p className="text-sm font-semibold text-gray-600">
                  Dự kiến giao: {new Date(order.eta).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:p-8">
          <h2 className="font-display mb-6 text-2xl font-bold">Sản phẩm</h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <Link
                key={item._id}
                to={`/foods/${item.food?._id}`}
                className="flex items-center gap-4 rounded-3xl border border-gray-100 p-3 transition hover:border-coral/40"
              >
                <img
                  src={item.food?.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=200"}
                  alt={item.food?.name || "Sản phẩm"}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold">{item.food?.name || "Sản phẩm"}</p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
                <span className="font-bold">{(Number(item.price) * item.quantity).toLocaleString("vi-VN")}đ</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="h-fit rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:p-8">
          <h2 className="font-display mb-6 text-2xl font-bold">Thông tin thanh toán</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
              <p className="mt-1 font-semibold">{order.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phương thức thanh toán</p>
              <p className="mt-1 font-semibold">{order.paymentMethod === "Banking" ? "VNPay" : order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
              <p className="mt-1 font-semibold">
                {order.paymentStatus === "Paid" ? "Đã thanh toán" : order.paymentStatus === "Pending" ? "Chờ thanh toán" : order.paymentStatus}
              </p>
            </div>
            <hr />
            <div className="flex justify-between"><span className="text-gray-500">Tạm tính</span><span className="font-semibold">{Number(order.subtotal || 0).toLocaleString("vi-VN")}đ</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phí giao hàng</span><span className="font-semibold">{Number(order.shippingFee || 0).toLocaleString("vi-VN")}đ</span></div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600"><span className="text-gray-500">Giảm giá</span><span className="font-semibold">-{Number(order.discountAmount).toLocaleString("vi-VN")}đ</span></div>
            )}
            <hr />
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng</span>
              <span className="text-coral">{Number(order.totalPrice || 0).toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;
