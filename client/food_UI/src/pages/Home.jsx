import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Category from "../components/Category";
import FoodCard from "../components/FoodCard";

import api from "../services/api";

function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await api.get("/foods");

        setFoods(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Không tải được danh sách món ăn.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Loading State
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

          <p className="mt-5 text-lg text-gray-500">
            Đang tải món ăn...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500">
            Có lỗi xảy ra
          </h2>

          <p className="mt-4 text-gray-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />

      <SearchBar />

      <Category />

      <section className="container mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold mb-8">
          Món ăn nổi bật
        </h2>

        {foods.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold">
              🍔 Chưa có món ăn
            </h2>

            <p className="mt-3 text-gray-500">
              Vui lòng quay lại sau.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >
            {foods.map((food) => (
              <FoodCard
              key={food._id}
              id={food._id}
              name={food.name}
              restaurant={food.restaurant?.name}
              price={food.price}
              image={
                  food.image ||
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
              }
          />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;