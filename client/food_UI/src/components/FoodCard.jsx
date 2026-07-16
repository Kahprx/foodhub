import { motion } from "framer-motion";
import { FaHeart, FaStar } from "react-icons/fa";
import Button from "./ui/Button";
import { Link } from "react-router-dom";
function FoodCard({
  id,
  name,
  restaurant,
  price,
  image,
}) {
  return (
     <Link to={`/foods/${id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.25 }}
        className="
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-md
        hover:shadow-2xl
        "
      >
      
        {/* Image */}

        <div className="relative">

          <img
            src={image}
            alt={name}
            className="w-full h-56 object-cover"
          />

          <button
            className="
            absolute
            top-4
            left-4
            bg-white
            p-3
            rounded-full
            shadow
            "
          >
            <FaHeart className="text-red-500" />
          </button>

          <span
            className="
            absolute
            top-4
            right-4
            bg-orange-500
            text-white
            text-xs
            px-3
            py-1
            rounded-full
            "
          >
            Best Seller
          </span>

        </div>

        {/* Content */}

        <div className="p-6">

          <h2 className="text-2xl font-bold">
            {name}
          </h2>

          <div className="flex items-center gap-2 mt-3">

            <FaStar className="text-yellow-400" />

            <span className="font-semibold">
              4.8
            </span>

            <span className="text-gray-500 text-sm">   
              (250 đánh giá)
            </span>

          </div>

          <p className="mt-3 text-gray-500">
            {restaurant}
          </p>

          <div className="mt-5">

            <p className="text-2xl font-bold text-orange-500">
              {Number(price).toLocaleString("vi-VN")}đ
            </p>

          </div>

          <div className="mt-6">

            <Button variant="primary">
              Đặt món ngay
            </Button>

          </div>

        </div>

      </motion.div>
    </Link>
  );
}


export default FoodCard;