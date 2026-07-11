import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function FoodDetail() {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await api.get(`/foods/${id}`);

        console.log(response.data);

        setFood(response.data.data);
      } catch (err) {
        console.log(err);
        setError("Không tải được món ăn");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div
            className="
              w-16
              h-16
              border-4
              border-orange-500
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />
          <p className="mt-5 text-gray-600">
            Đang tải món ăn...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-red-500 font-bold">
          {error}
        </h2>
      </div>
    );
  }

  // Không tìm thấy món ăn
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
    <section className="container mx-auto px-6 py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* Image */}
        <div>
          <img
            src={
              food.image ||
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000"
            }
            alt={food.name}
            className="
              w-full
              rounded-3xl
              shadow-2xl
              object-cover
            "
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-5xl font-extrabold">
            {food.name}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-yellow-500 text-xl">
              ⭐⭐⭐⭐⭐
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

            <h2 className="text-4xl font-bold text-orange-500 mt-2">
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

          {/* Quantity UI */}
          <div className="mt-10 flex items-center gap-4">
            <button
              className="
                w-12
                h-12
                rounded-xl
                bg-gray-100
                hover:bg-gray-200
              "
            >
              -
            </button>

            <span className="text-2xl font-bold">
              1
            </span>

            <button
              className="
                w-12
                h-12
                rounded-xl
                bg-orange-500
                text-white
                hover:bg-orange-600
              "
            >
              +
            </button>
          </div>

          <button
            className="
              mt-10
              px-8
              py-4
              rounded-2xl
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-bold
              text-lg
              transition
              shadow-lg
            "
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>

      </div>
    </section>
  );
}

export default FoodDetail;