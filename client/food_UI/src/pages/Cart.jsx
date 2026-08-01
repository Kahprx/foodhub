import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { PAYMENT_METHODS, PAYMENT_STORAGE_KEY } from "../constants/payment";
import {
  FaTrashAlt,
  FaMoneyBillWave,
  FaTruck,
  FaReceipt,
  FaTag,
} from "react-icons/fa";

function Cart() {
  const { 
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem("foodhub-coupon");
    return saved ? JSON.parse(saved) : null;
  });
  const [couponError, setCouponError] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(() => localStorage.getItem(PAYMENT_STORAGE_KEY) || "COD");

  const updateAppliedCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    if (coupon) localStorage.setItem("foodhub-coupon", JSON.stringify(coupon));
    else localStorage.removeItem("foodhub-coupon");
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 0 ? 20000 : 0;
  const discount = appliedCoupon?.discount || 0;

  const total = subtotal + shippingFee - discount;

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCheckingCoupon(true);
    setCouponError("");
    try {
      const response = await api.get(`/orders/coupon/${code}`, {
        params: { subtotal },
      });
      updateAppliedCoupon({ code, discount: response.data.data?.discount || 0 });
    } catch (err) {
      setCouponError(err.response?.data?.message || "Mã giảm giá không hợp lệ.");
      updateAppliedCoupon(null);
    } finally {
      setCheckingCoupon(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex justify-center items-center px-6"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              delay: 0.2,
              duration: 0.4,
              y: {
                repeat: Infinity,
                duration: 2,
              },
            }}
            className="text-8xl mb-8"
          >
            🛒
          </motion.div>
          <h1 className="text-5xl font-extrabold">
            Giỏ hàng trống
          </h1>
          <p className="mt-6 text-gray-500 text-lg">
            Bạn chưa thêm đồ chơi nào vào giỏ
          </p>
          <Link
            to="/menu"
            className="inline-block mt-10 px-8 py-4 rounded-2xl bg-coral text-white font-bold transition hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0"
          >
            🧸 Khám phá Shop
          </Link>
        </div>
      </motion.section>
    );
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-24">

      <div className="flex flex-col sm:flex-row gap-5 justify-between items-center mb-10">

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          Giỏ hàng
        </h1>

        <button
          onClick={clearCart}
          className="
            w-full
            sm:w-auto
            px-5
            py-3
            rounded-2xl
            bg-red-50
            text-red-500
            border
            border-red-100
            hover:bg-red-500
            hover:text-white
            font-semibold
            transition-all
            duration-300
            hover:rotate-1
          "
        >
          🗑 Xóa tất cả
        </button>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 ">

        {/* Left */}

        <div className="lg:col-span-2 space-y-6">

          <AnimatePresence mode = "popLayout">
          {cartItems.map((item) => (

            <motion.div
              key={item._id}
              layout
              initial ={{
                opacity : 0,
                y:40,
                scale :0.95,
              }}
              animate ={{
                opacity : 1,
                y : 0,
                scale :1,
              }}
              exit={{
                opacity : 0,
                x : 120,
                scale : 0.8,
              }}
              transition={{
                duration :  0.35,
              }}
              whileHover={{
                scale: 1.01,
              }}
              className="bg-white ring-1 ring-black/5 rounded-3xl shadow-card hover:shadow-lift hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col sm:flex-row gap-6 items-center"
            >

              <motion.img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"
                }
                alt={item.name}
                whileHover={{
                  scale: 1.08,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="
                  w-full
                  sm:w-36
                  h-52
                  sm:h-36
                  rounded-3xl
                  object-cover
                "
              />

              <div className="flex-1
    min-w-0
    w-full
    text-center
    sm
    ">

                <h2 className="text-xl font-bold truncate">
                  {item.name}
                </h2>

                <p className="text-coral font-bold text-xl mt-2">
                  {item.price.toLocaleString()}đ
                </p>

                <div className=" flex
    justify-center
    sm:justify-start
    items-center
    gap-3
    mt-4">

                  <button
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-gray-100
                      hover:bg-gray-200
                      transition
                      font-bold
                    "
                  >
                    -
                  </button>

                  <motion.span
                    layout
                    className="w-9 h-9 rounded-full bg-sunny text-ink font-bold flex items-center justify-center"
                  >
                    {item.quantity}
                  </motion.span>

                  <button
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                      className="
                      w-9
                      h-9
                      rounded-xl
                      bg-coral
                      hover:bg-coral/90
                      text-white
                      transition
                      font-bold
                    "
                  >
                    +
                  </button>

                </div>

              </div>

              <button
                onClick={() => {
                  if (window.confirm("Bạn có chắc muốn xóa đồ chơi này?")) {
                    removeFromCart(item._id);
                  }
                }}
                className="
                  w-full
  sm:w-auto
  flex
  justify-center
  items-center
  gap-2
  px-5
  py-3
  rounded-2xl
  bg-red-50
  text-red-500
  border
  border-red-100
  hover:bg-red-500
  hover:text-white
  transition-all
  duration-300
  hover:scale-105
                "
              >
                <FaTrashAlt />
                Xóa
              </button>

            </motion.div>

          ))}
          </AnimatePresence>

        </div>

        {/* Right */}

        <div
          className="
            bg-white
            ring-1
            ring-black/5
            rounded-3xl
            shadow-lift
            p-8
            h-fit
            sticky
            top-28
          "
        >

          <h2 className="text-2xl lg:text-3xl font-bold mb-8">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-5">

            {!appliedCoupon ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-600">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Nhập mã (VD: TOY10)"
                    className="w-full rounded-xl border-2 border-gray-100 px-4 py-2.5 font-semibold outline-none transition focus:border-coral"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={checkingCoupon || !couponCode.trim()}
                    className="shrink-0 rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal/90 disabled:opacity-40"
                  >
                    {checkingCoupon ? "..." : "Áp dụng"}
                  </button>
                </div>
                {couponError && <p className="mt-2 text-sm text-red-500">{couponError}</p>}
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <FaTag />
                  <span className="font-bold">{appliedCoupon.code}</span>
                </div>
                <button
                  onClick={() => { updateAppliedCoupon(null); setCouponCode(""); }}
                  className="text-sm font-semibold text-red-500 hover:underline"
                >
                  Bỏ áp dụng
                </button>
              </div>
            )}

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-600">
                Phương thức thanh toán
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      localStorage.setItem(PAYMENT_STORAGE_KEY, method.id);
                    }}
                    className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition ${
                      paymentMethod === method.id
                        ? "border-coral bg-coral/5 text-coral"
                        : "border-gray-100 text-gray-700 hover:border-coral/40"
                    }`}
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="truncate">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">

              <div className="flex gap-2 text-gray-500">
                <FaMoneyBillWave className="mt-0.5" />
                <span>Tạm tính</span>
              </div>

              <span className="font-semibold">
                {subtotal.toLocaleString()}đ
              </span>

            </div>

            <div className="flex justify-between">

              <div className="flex gap-2 text-gray-500">
                <FaTruck className="mt-0.5" />
                <span>Phí giao hàng</span>
              </div>

              <span className="font-semibold">
                {shippingFee.toLocaleString()}đ
              </span>

            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <div className="flex gap-2">
                  <FaTag className="mt-0.5" />
                  <span>Giảm giá</span>
                </div>
                <span className="font-semibold">
                  -{discount.toLocaleString()}đ
                </span>
              </div>
            )}

            <hr />

            <div className="flex justify-between">

              <div className="flex gap-2">
                <FaReceipt className="mt-1.5" />
                <span className="text-2xl font-bold">
                  Tổng
                </span>
              </div>

              <span
                className="
                  text-4xl
                  font-black
                  text-coral
                  tracking-tight
                "
              >
                {total.toLocaleString()}đ
              </span>

            </div>

          </div>

          <Link
    to="/checkout"
    className="
        block
        mt-8
        w-full
        py-4
        rounded-3xl
        bg-teal
        text-white
        text-center
        font-bold
        text-lg
        hover:-translate-y-0.5
        hover:shadow-soft
        transition
    "
>
    Thanh toán
</Link>

        </div>
      </div>

    </section>
  );
}

export default Cart;
