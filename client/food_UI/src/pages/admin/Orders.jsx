import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
  Delivering: "bg-indigo-100 text-indigo-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusOptions = [
  "",
  "Pending",
  "Confirmed",
  "Preparing",
  "Delivering",
  "Completed",
  "Cancelled",
];

function Orders() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword.trim()) params.set("keyword", keyword.trim());
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", page);
      params.set("limit", 10);

      const res = await api.get(`/orders/all?${params.toString()}`);
      setOrders(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
      toast.error("Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Cập nhật trạng thái thành công!");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const customerName = (order) =>
    order.user?.fullName || order.user?.email || "Khách đã xoá";

  const handleExportExcel = async () => {
    try {
      const res = await api.get("/orders/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orders-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Xuất Excel thất bại");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <p className="mt-1 text-sm text-gray-500">{total} đơn hàng</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            ⬇️ Xuất Excel
          </button>
          <input
            type="text"
            placeholder="Tìm khách hàng, mã đơn, món..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="w-72 rounded-xl border px-4 py-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
              setSearchParams(e.target.value ? { status: e.target.value } : {});
            }}
            className="rounded-xl border px-4 py-2"
          >
            {statusOptions.map((s) => (
              <option key={s || "all"} value={s}>
                {s ? s : "Tất cả trạng thái"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Sản phẩm</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thanh toán</th>
              <th className="p-4">Ngày</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  Không tìm thấy đơn hàng.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-semibold">{customerName(order)}</p>
                    <p className="text-xs text-gray-400">#{order._id.toString().slice(-6)}</p>
                  </td>
                  <td className="max-w-[240px] p-4">
                    <button
                      className="text-sm text-gray-600 hover:text-blue-600"
                      onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    >
                      {order.items.length} món {expanded === order._id ? "▲" : "▼"}
                    </button>
                    {expanded === order._id && (
                      <div className="mt-2 space-y-1 text-xs">
                        {order.items.map((item, i) => (
                          <p key={i}>
                            {item.food?.name || "?"} x{item.quantity} — {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                          </p>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-semibold">
                    {order.totalPrice?.toLocaleString("vi-VN")}đ
                    {order.discountAmount > 0 && (
                      <p className="text-xs text-green-600">-{order.discountAmount.toLocaleString("vi-VN")}đ</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{order.paymentMethod}</td>
                  <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="rounded-lg border px-2 py-1.5 text-sm"
                      >
                        {statusOptions.filter(Boolean).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Xem
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border px-4 py-2 font-semibold disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="font-semibold">Trang {page}/{totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border px-4 py-2 font-semibold disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}

export default Orders;
