import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Success() {
  const orderId = Math.floor(Math.random() * 1000000);

  return (
    <section className="min-h-screen flex justify-center items-center px-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
          bg-white
          rounded-3xl
          shadow-xl
          p-12
          text-center
          max-w-lg
          w-full
        "
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 200,
          }}
          className="text-7xl"
        >
          ✅
        </motion.div>

        <h1 className="text-4xl font-bold mt-6">
          Đặt hàng thành công
        </h1>

        <p className="text-gray-500 mt-4">
          Cảm ơn bạn đã sử dụng FoodHub.
        </p>

        <div className="mt-8">

          <p className="text-gray-500">
            Mã đơn hàng
          </p>

          <h2 className="text-3xl font-bold text-orange-500">
            #{orderId}
          </h2>

        </div>

        <Link
          to="/"
          className="
            inline-block
            mt-10
            px-8
            py-4
            rounded-2xl
            bg-orange-500
            hover:bg-orange-600
            text-white
            font-bold
          "
        >
          Quay về Trang chủ
        </Link>

      </motion.div>

    </section>
  );
}

export default Success;