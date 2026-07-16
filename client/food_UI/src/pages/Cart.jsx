import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { FaTrashAlt } from "react-icons/fa";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 0 ? 20000 : 0;

  const total = subtotal + shippingFee;

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
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-8xl mb-8"
          >
            🛒
          </motion.div>
          <h1 className="text-5xl font-extrabold">
            Giỏ hàng trống
          </h1>
          <p className="mt-6 text-gray-500 text-lg">
            Bạn chưa thêm món ăn nào, vui lòng đặt món ăn
          </p>
          <Link
            to="/menu"
            className="inline-block mt-10 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition hover:scale-105 active:scale-95"
          >
            🍔 Khám phá Menu
          </Link>
        </div>
      </motion.section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-32">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold">
          Giỏ hàng
        </h1>

        <button
          onClick={clearCart}
          className="
            px-5
            py-3
            rounded-xl
            bg-red-500
            hover:bg-red-600
            text-white
            font-semibold
            transition
          "
        >
          Xóa tất cả
        </button>

      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Left */}

        <div className="lg:col-span-2 space-y-6">

          <AnimatePresence>
          {cartItems.map((item) => (

            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="
                bg-white
                rounded-3xl
                shadow-lg
                p-6
                flex
                gap-6
                items-center
              "
            >

              <img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
                }
                alt={item.name}
                className="
                  w-28
                  h-28
                  rounded-2xl
                  object-cover
                "
              />

              <div className="flex-1 min-w-0">

                <h2 className="text-xl font-bold truncate">
                  {item.name}
                </h2>

                <p className="text-orange-500 text-lg mt-1">
                  {item.price.toLocaleString()}đ
                </p>

                <div className="flex items-center gap-3 mt-4">

                  <button
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-gray-100
                      hover:bg-gray-200
                      transition
                      font-bold
                    "
                  >
                    -
                  </button>

                  <span className="font-bold text-lg w-6 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-orange-500
                      hover:bg-orange-600
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
                  if (window.confirm("Bạn có chắc muốn xóa món này?")) {
                    removeFromCart(item._id);
                  }
                }}
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-red-500
                  hover:bg-red-600
                  text-white
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
            rounded-3xl
            shadow-xl
            p-8
            h-fit
            sticky
            top-32
          "
        >

          <h2 className="text-3xl font-bold mb-8">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-gray-500">
                Tạm tính
              </span>

              <span className="font-semibold">
                {subtotal.toLocaleString()}đ
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-500">
                Phí giao hàng
              </span>

              <span className="font-semibold">
                {shippingFee.toLocaleString()}đ
              </span>

            </div>

            <hr />

            <div className="flex justify-between">

              <span className="text-2xl font-bold">
                Tổng
              </span>

              <span
                className="
                  text-3xl
                  font-bold
                  text-orange-500
                "
              >
                {total.toLocaleString()}đ
              </span>

            </div>

          </div>

          <button
            className="
              mt-8
              w-full
              py-4
              rounded-2xl
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-bold
              text-lg
              transition-all
              duration-300
              hover:scale-105
              active:scale-95
            "
          >
            Thanh toán
          </button>

        </div>
      </div>

    </section>
  );
}

export default Cart;
