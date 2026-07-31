import { useEffect, useState } from "react";
import api from "../services/api";

const statusLabels = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Preparing: "Đang chuẩn bị",
  Delivering: "Đang giao",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
};

const statusColors = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-sky-100 text-sky-700",
  Preparing: "bg-violet-100 text-violet-700",
  Delivering: "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-coral border-t-transparent" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-6 pt-28 pb-24 text-center">
        <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
        <p className="mt-5 text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto min-h-screen px-6 pt-28 pb-24">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold">Đơn hàng của tôi</h1>
        <p className="mt-2 text-gray-500">Theo dõi các đơn hàng bạn đã đặt.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-card ring-1 ring-black/5">
          <p className="text-5xl">📦</p>
          <h2 className="mt-5 text-2xl font-bold">Bạn chưa có đơn hàng nào</h2>
          <p className="mt-2 text-gray-500">Hãy chọn món đồ chơi và đặt đơn đầu tiên của bạn.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const createdAt = new Date(order.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <article key={order._id} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn #{order._id.slice(-6).toUpperCase()}</p>
                    <h2 className="mt-1 text-xl font-bold">{order.restaurant?.name || "Đơn hàng HAPPYHOMES"}</h2>
                    <p className="mt-1 text-sm text-gray-500">Đặt ngày {createdAt} · {order.items?.length || 0} món</p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-5">
                  <span className="text-gray-500">Tổng thanh toán</span>
                  <strong className="text-lg text-coral">{Number(order.totalPrice || 0).toLocaleString("vi-VN")}đ</strong>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Orders;
