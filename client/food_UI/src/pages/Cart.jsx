import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  FaTrashAlt,
  FaMoneyBillWave,
  FaTruck,
  FaReceipt,
} from "react-icons/fa";

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
    <section className="container mx-auto px-4 sm:px-6 py-24 lg:py-32">

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
            rounded-xl
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
              className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col sm:flex-row gap-6 items-center"
            >

              <motion.img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
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
                  rounded-2xl
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

                <p className="text-orange-500 font-bold text-xl mt-2">
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
                      rounded-lg
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
                    className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center"
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
                  w-full
  sm:w-auto
  flex
  justify-center
  items-center
  gap-2
  px-5
  py-3
  rounded-xl
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
            bg-gradient-to-br
            from-orange-50
            to-white
            rounded-3xl
            shadow-2xl
            p-8
            h-fit
            sticky
            top-32
          "
        >

          <h2 className="text-2xl lg:text-3xl font-bold mb-8">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-5">

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
                  text-orange-500
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
        rounded-2xl
        bg-gradient-to-r
        from-orange-500
        to-red-500
        text-white
        text-center
        font-bold
        text-lg
        hover:scale-105
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
