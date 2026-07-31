import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
  Delivering: "bg-indigo-100 text-indigo-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const shippingProviders = ["SPX", "GHN", "ViettelPost"];

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shipping, setShipping] = useState({
    shippingProvider: "",
    trackingNumber: "",
    shipmentStatus: "",
    eta: "",
  });
  const [savingShipping, setSavingShipping] = useState(false);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data.data);
        setShipping({
          shippingProvider: res.data.data.shippingProvider || "",
          trackingNumber: res.data.data.trackingNumber || "",
          shipmentStatus: res.data.data.shipmentStatus || "",
          eta: res.data.data.eta ? res.data.data.eta.slice(0, 10) : "",
        });
      })
      .catch((err) =>
        setError(
          err.response?.data?.message || "Failed to load order"
        )
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveShipping = async () => {
    setSavingShipping(true);
    try {
      const response = await api.put(`/orders/${id}/shipping`, shipping);
      setOrder(response.data.data);
      toast.success("Đã cập nhật thông tin vận chuyển");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSavingShipping(false);
    }
  };

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

          <div className="mt-6 rounded-2xl border-2 border-teal/30 bg-teal/5 p-4">
            <h3 className="mb-3 font-bold">🚚 Cập nhật vận chuyển</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Đơn vị vận chuyển</label>
                <select
                  value={shipping.shippingProvider}
                  onChange={(e) => setShipping({ ...shipping, shippingProvider: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="">Chọn đơn vị</option>
                  {shippingProviders.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Mã vận đơn</label>
                <input
                  value={shipping.trackingNumber}
                  onChange={(e) => setShipping({ ...shipping, trackingNumber: e.target.value })}
                  placeholder="VD: VN1234567890"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Trạng thái vận chuyển</label>
                <input
                  value={shipping.shipmentStatus}
                  onChange={(e) => setShipping({ ...shipping, shipmentStatus: e.target.value })}
                  placeholder="VD: Đang tại kho trung chuyển"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Ngày dự kiến giao</label>
                <input
                  type="date"
                  value={shipping.eta}
                  onChange={(e) => setShipping({ ...shipping, eta: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleSaveShipping}
                disabled={savingShipping}
                className="w-full rounded-lg bg-teal px-3 py-2 font-bold text-white transition hover:bg-teal/90 disabled:opacity-40"
              >
                {savingShipping ? "Đang lưu..." : "Lưu thông tin vận chuyển"}
              </button>
            </div>
          </div>

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
