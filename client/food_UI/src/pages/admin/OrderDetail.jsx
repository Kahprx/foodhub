import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
  Delivering: "bg-indigo-100 text-indigo-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Failed to load order"
        )
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error || "Order not found"}</p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  const customerName =
    order.user?.fullName || order.user?.email || "Khách đã xoá";

  return (
    <div className="p-8">
      <button
        onClick={() => navigate("/admin/orders")}
        className="mb-6 text-blue-600 hover:underline font-semibold"
      >
        ← Back to Orders
      </button>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">
          Order Detail
        </h1>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            statusColors[order.status] ||
            "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Items
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-3">Toy</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">
                      {item.food?.name || "Món đã xoá"}
                    </td>
                    <td className="p-3">
                      {item.price?.toLocaleString()}đ
                    </td>
                    <td className="p-3">x{item.quantity}</td>
                    <td className="p-3 text-right font-semibold">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-lg font-semibold">Tổng cộng</span>
            <span className="text-2xl font-bold text-blue-600">
              {order.totalPrice?.toLocaleString()}đ
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">
            Order Info
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-semibold break-all">{order._id}</p>
            </div>

            <div>
              <p className="text-gray-500">Customer</p>
              <p className="font-semibold">{customerName}</p>
            </div>

            <div>
              <p className="text-gray-500">Restaurant</p>
              <p className="font-semibold">
                {order.restaurant?.name || "Không xác định"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Payment</p>
              <p className="font-semibold">{order.paymentMethod}</p>
            </div>

            <div>
              <p className="text-gray-500">Delivery Address</p>
              <p className="font-semibold">
                {order.deliveryAddress || "Không xác định"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Created</p>
              <p className="font-semibold">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
