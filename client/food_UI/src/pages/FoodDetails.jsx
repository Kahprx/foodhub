import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import api from "../services/api";
import FoodCard from "../components/FoodCard";
import FoodSkeleton from "../components/FoodSkeleton";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

function FoodDetail() {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedFoods, setRelatedFoods] = useState([]);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await api.get(`/foods/${id}`);

        const currentFood = response.data.data;

        setFood(currentFood);

        // Related Foods
        if (currentFood.category) {
          const relatedResponse = await api.get(
            `/foods?category=${currentFood.category}`
          );

          const filtered = relatedResponse.data.data.filter(
            (item) => item._id !== currentFood._id
          );

          setRelatedFoods(filtered);
        }
      } catch (err) {
        console.log(err);
        setError("Không tải được món ăn");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Loading

  if (loading) {
    return <FoodSkeleton />;
  }

  // Error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-bold text-red-500">
          {error}
        </h2>
      </div>
    );
  }

  // Empty
  if (!food) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-bold">
          Không tìm thấy món ăn
        </h2>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 ">

      {/* Main */}

      <div className=" grid
  grid-cols-1
  lg:grid-cols-2
  gap-10
  lg:gap-16
  items-start">

        {/* Image */}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >

          <img
            src={
              food.image ||
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000"
            }
            alt={food.name}
            className="
              w-full
              max-h-[500px]
              lg:max-h-[550px]
              object-cover
              rounded-3xl
              shadow-2xl
              transition-all
              duration-500
              hover:scale-105
            "
          />

        </motion.div>

        {/* Info */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
            {food.name}
          </h1>

          <div className="flex items-center gap-3 mt-4">

            <span className="flex text-yellow-400 text-lg gap-0.5">
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </span>

            <span className="text-gray-500">
              4.9 (120 đánh giá)
            </span>

          </div>

          <div className="mt-8">

            <p className="text-gray-500">
              Nhà hàng
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {food.restaurant?.name || "FoodHub"}
            </h3>

          </div>

          <div className="mt-8">

            <p className="text-gray-500">
              Giá
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mt-2">
              {food.price?.toLocaleString()}đ
            </h2>

          </div>

          <div className="mt-8">

            <h3 className="text-2xl font-bold">
              Mô tả
            </h3>

            <p className="text-gray-600 mt-3 leading-8">
              {food.description ||
                "Món ăn thơm ngon được chế biến từ nguyên liệu tươi sạch."}
            </p>

          </div>

          {/* Quantity */}

          <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={decreaseQuantity}
              className="
                w-12 h-12 rounded-xl
                bg-gray-100 hover:bg-gray-200
                transition-all duration-200
              "
            >
              -
            </motion.button>

            <motion.span
              key={quantity}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold w-8 text-center"
            >
              {quantity}
            </motion.span>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={increaseQuantity}
              className="
                w-12 h-12 rounded-xl
                bg-orange-500 text-white hover:bg-orange-600
                transition-all duration-200
              "
            >
              +
            </motion.button>

          </div>

          {/* Button */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(food, quantity)}
            className="
              mt-10
              w-full
              sm:w-auto
              px-8
              py-4
              rounded-2xl
              bg-orange-500
              hover:bg-orange-600
              hover:shadow-lg hover:shadow-orange-300
              text-white
              font-bold
              text-lg
              transition-all duration-300
              shadow-lg
            "
          >
            🛒 Thêm vào giỏ hàng
          </motion.button>

        </motion.div>

      </div>

      {/* Related Foods */}

      <motion.section
        className="mt-24"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >

        <h2 className="text-3xl font-bold mb-10">
          Bạn cũng có thể thích
        </h2>

        {relatedFoods.length === 0 ? (

          <p className="text-gray-500 text-lg">
            🍔 Chưa có món ăn liên quan
          </p>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >

            {relatedFoods.map((item) => (

              <FoodCard
                key={item._id}
                id={item._id}
                name={item.name}
                restaurant={item.restaurant?.name}
                price={item.price}
                image={
                  item.image ||
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
                }
              />

            ))}

          </div>

        )}

      </motion.section>

    </section>
  );
}

export default FoodDetail;