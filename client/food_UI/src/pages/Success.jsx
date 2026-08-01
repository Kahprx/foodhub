import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || Math.floor(Math.random() * 1000000);

  return (
    <section className="min-h-screen flex justify-center items-center px-6 pt-20">

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
          bg-white
          rounded-3xl
          shadow-lift
          ring-1
          ring-black/5
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
          Cảm ơn bạn đã mua sắm tại HAPPYHOMES.
        </p>

        <div className="mt-8">

          <p className="text-gray-500">
            Mã đơn hàng
          </p>

          <h2 className="text-3xl font-bold text-coral">
            #{String(orderId).slice(-6).toUpperCase()}
          </h2>

        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/orders"
            className="
              inline-block
              px-8
              py-4
              rounded-3xl
              bg-teal
              hover:bg-teal/90
              text-white
              font-bold
            "
          >
            Xem đơn hàng
          </Link>
          <Link
            to="/"
            className="
              inline-block
              px-8
              py-4
              rounded-3xl
              bg-coral
              hover:bg-coral/90
              text-white
              font-bold
            "
          >
            Quay về Trang chủ
          </Link>
        </div>

      </motion.div>

    </section>
  );
}

export default Success;
