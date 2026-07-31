import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
  "Pending",
  "Confirmed",
  "Preparing",
  "Delivering",
  "Completed",
  "Cancelled",
];

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, {
        status,
      });

      toast.success("Order updated successfully!");
      fetchOrders();
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    }
  };

  const customerName = (order) =>
    order.user?.fullName ||
    order.user?.email ||
    "Khách đã xoá";

  const filteredOrders = orders.filter((order) => {
    const kw = keyword.trim().toLowerCase();
    const matchKw =
      !kw ||
      customerName(order).toLowerCase().includes(kw) ||
      order._id.toLowerCase().includes(kw) ||
      (order.deliveryAddress || "").toLowerCase().includes(kw);
    const matchStatus = !statusFilter || order.status === statusFilter;
    return matchKw && matchStatus;
  });

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">
          Order Management
        </h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search customer, ID, address..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded-xl px-4 py-2 w-80"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-4 py-2"
          >
            <option value="">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    {customerName(order)}
                  </td>

                  <td className="p-4 font-semibold">
                    {order.totalPrice?.toLocaleString()}đ
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-2 py-1.5 text-sm"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          navigate(`/admin/orders/${order._id}`)
                        }
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
