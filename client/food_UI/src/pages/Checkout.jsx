import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CurvedInput from "../components/bits/CurvedInput";
import SpecularButton from "../components/bits/SpecularButton";
import { PAYMENT_METHODS, PAYMENT_STORAGE_KEY } from "../constants/payment";

const shippingProviders = [
  { id: "SPX", label: "SPX Express", eta: "1 - 3 ngày", fee: 20000 },
  { id: "GHN", label: "Giao Hàng Nhanh", eta: "1 - 2 ngày", fee: 25000 },
  { id: "ViettelPost", label: "Viettel Post", eta: "2 - 4 ngày", fee: 18000 },
];

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [shippingProvider, setShippingProvider] = useState("SPX");
  const [paymentMethod, setPaymentMethod] = useState(() => localStorage.getItem(PAYMENT_STORAGE_KEY) || "COD");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem("foodhub-coupon");
    return saved ? JSON.parse(saved) : null;
  });

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? shippingProviders.find((p) => p.id === shippingProvider)?.fee || 20000 : 0;
  const discount = coupon?.discount || 0;
  const total = subtotal + shippingFee - discount;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        const profile = response.data.data;
        if (profile.fullName) setForm((prev) => ({ ...prev, name: prev.name || profile.fullName }));
        if (profile.phone) setForm((prev) => ({ ...prev, phone: prev.phone || profile.phone }));
        if (profile.addresses?.length) setSavedAddresses(profile.addresses);
      } catch {
        // Profile is optional for the checkout flow.
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setPlacingOrder(true);
    setOrderError("");

    const deliveryAddress = `${form.name} - ${form.phone} - ${form.address}${form.note ? ` - Ghi chú: ${form.note}` : ""}`;

    try {
      const response = await api.post(
        "/orders",
        {
          deliveryAddress,
          paymentMethod: paymentMethod === "VNPay" ? "Banking" : paymentMethod === "Stripe" ? "Stripe" : paymentMethod === "Momo" ? "Momo" : "COD",
          couponCode: coupon?.code || undefined,
          shippingFee,
          shippingProvider,
        }
      );

      const order = response.data.data;
      const orderId = order?._id;
      const amount = order?.totalPrice || total;

      if (paymentMethod === "VNPay") {
        const pay = await api.post("/payments/vnpay/create", { orderId, amount });
        if (pay.data.url) window.location.href = pay.data.url;
        else setOrderError("Không tạo được liên kết VNPay.");
      } else if (paymentMethod === "Momo") {
        const pay = await api.post("/payments/momo/create", { orderId, amount });
        if (pay.data.url) window.location.href = pay.data.url;
        else setOrderError("Không tạo được liên kết MoMo.");
      } else if (paymentMethod === "Stripe") {
        const pay = await api.post("/payments/stripe/create", { orderId, amount });
        if (pay.data.url) window.location.href = pay.data.url;
        else setOrderError("Stripe chưa được cấu hình, đơn hàng đã được tạo (COD).");
      } else {
        localStorage.removeItem("foodhub-coupon");
        clearCart();
        navigate(`/success?orderId=${orderId}`);
      }
    } catch (err) {
      setOrderError(err.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="container mx-auto px-6 pb-24 pt-28 lg:pt-32">
      <h1 className="font-display mb-10 text-4xl font-bold lg:text-5xl">
        Thanh toán
      </h1>

      {cartItems.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
          <p className="text-xl font-bold">Giỏ hàng của bạn đang trống</p>
          <p className="mt-2 text-gray-500">Hãy thêm món ăn trước khi tiến hành thanh toán.</p>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="mt-6 rounded-3xl bg-coral px-6 py-3 font-bold text-white transition hover:bg-coral/90"
          >
            Xem thực đơn
          </button>
        </div>
      )}

      {cartItems.length > 0 && (
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="font-display mb-6 text-2xl font-bold">
              Thông tin giao hàng
            </h2>

            {savedAddresses.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-gray-600">Địa chỉ đã lưu:</p>
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((address) => (
                    <button
                      key={address}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, address }))}
                      className="rounded-2xl border border-gray-200 px-4 py-2 text-left text-sm text-gray-600 transition hover:border-coral hover:text-coral"
                    >
                      {address}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="mb-2 block font-semibold">Họ và tên</label>
                <CurvedInput type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nhập họ tên" />
                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-2 block font-semibold">Số điện thoại</label>
                <CurvedInput type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Nhập số điện thoại" />
                {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-2 block font-semibold">Địa chỉ giao hàng</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Nhập địa chỉ"
                  className="w-full rounded-2xl border-2 border-ink bg-white px-5 py-3.5 font-semibold shadow-chunky-sm outline-none transition focus:shadow-chunky placeholder:text-ink/40 resize-none"
                />
                {errors.address && <p className="mt-2 text-sm text-red-500">{errors.address}</p>}
              </div>
              <div>
                <label className="mb-2 block font-semibold">Ghi chú</label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ví dụ: Gói quà tặng, giao giờ hành chính..."
                  className="w-full rounded-2xl border-2 border-ink bg-white px-5 py-3.5 font-semibold shadow-chunky-sm outline-none transition focus:shadow-chunky placeholder:text-ink/40 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="font-display mb-6 text-2xl font-bold">Phương thức giao hàng</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {shippingProviders.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setShippingProvider(provider.id)}
                  className={`rounded-3xl border-2 p-4 text-left transition ${
                    shippingProvider === provider.id
                      ? "border-coral bg-coral/5"
                      : "border-gray-100 hover:border-coral/40"
                  }`}
                >
                  <p className="font-bold">{provider.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{provider.eta}</p>
                  <p className="mt-1 text-sm font-semibold text-coral">{provider.fee.toLocaleString("vi-VN")}đ</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="font-display mb-6 text-2xl font-bold">Phương thức thanh toán</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(method.id);
                    localStorage.setItem(PAYMENT_STORAGE_KEY, method.id);
                  }}
                  className={`flex items-center gap-3 rounded-3xl border-2 p-4 text-left transition ${
                    paymentMethod === method.id
                      ? "border-coral bg-coral/5"
                      : "border-gray-100 hover:border-coral/40"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-semibold">{method.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="h-fit rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5 lg:sticky lg:top-28">
          <h2 className="font-display mb-6 text-2xl font-bold">Tóm tắt đơn hàng</h2>

          <div className="space-y-5">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
                <span className="font-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}

            <hr />

            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>

            <div className="flex justify-between">
              <span>Ship</span>
              <span>{shippingFee.toLocaleString()}đ</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Giảm giá ({coupon?.code})</span>
                <span>-{discount.toLocaleString()}đ</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>Tổng</span>
              <span className="text-coral">{total.toLocaleString()}đ</span>
            </div>

            <SpecularButton onClick={handlePlaceOrder} disabled={placingOrder} className="w-full justify-center text-base">
              {placingOrder ? "Đang xử lý..." : "Đặt hàng"}
            </SpecularButton>

            {orderError && <p className="mt-3 text-center text-sm text-red-500">{orderError}</p>}
          </div>
        </div>
      </div>
      )}
    </section>
  );
}

export default Checkout;
