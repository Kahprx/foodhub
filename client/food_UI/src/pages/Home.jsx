import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Category from "../components/Category";
import FoodCard from "../components/FoodCard";
import LogoLoop from "../components/bits/LogoLoop";
import FadeContent from "../components/bits/FadeContent";
import MagicBento from "../components/bits/MagicBento";
import SpecularButton from "../components/bits/SpecularButton";

import api from "../services/api";

const brands = ["LEGO", "Hasbro", "Barbie", "Hot Wheels", "Mattel", "Fisher-Price", "VTech", "Playmobil", "Bandai", "GIGA BLOCKS"];

function SectionTitle({ accent, title, note }) {
  return (
    <FadeContent>
      <div className="mb-10">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">{note}</p>
        <h2 className="mt-2 text-4xl font-bold">
          {title} <span className="text-coral">{accent}</span>
        </h2>
      </div>
    </FadeContent>
  );
}

function LoadingState() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-ink border-t-coral" />
        <p className="mt-5 font-display text-lg font-bold text-ink/60">Đang tải đồ chơi...</p>
      </div>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-coral">Có lỗi xảy ra</h2>
        <p className="mt-4 text-ink/60">{error}</p>
      </div>
    </div>
  );
}

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
        setError("Không tải được danh sách đồ chơi.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const featured = foods.slice(0, 6);
  const newArrivals = foods.slice(6, 12);
  const bestSellers = [...foods].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

  return (
    <>
      <Hero />
      <SearchBar />
      <Category />

      <section className="border-y border-black/5 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <LogoLoop logos={brands} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionTitle note="Được chọn nhiều" title="Đồ chơi nổi" accent="bật" />

        {featured.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-3xl font-bold">🧸 Chưa có đồ chơi</h2>
            <p className="mt-3 text-ink/60">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((food) => (
              <FoodCard
                key={food._id}
                id={food._id}
                name={food.name}
                restaurant={food.restaurant?.name}
                category={food.category}
                price={food.price}
                image={food.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"}
                rating={food.rating}
              />
            ))}
          </div>
        )}
      </section>

      {newArrivals.length > 0 && (
        <section className="border-y border-lilac/20 bg-gradient-to-b from-lilac/10 to-transparent py-16">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle note="Vừa cập bến" title="Hàng" accent="mới về" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {newArrivals.map((food) => (
                <FoodCard
                  key={food._id}
                  id={food._id}
                  name={food.name}
                  restaurant={food.restaurant?.name}
                  category={food.category}
                  price={food.price}
                  image={food.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"}
                  rating={food.rating}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <SectionTitle note="Các bé mê nhất" title="Bán" accent="chạy nhất" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {bestSellers.map((food, index) => (
              <div key={food._id} className={index % 2 === 1 ? "md:mt-10" : ""}>
                <FoodCard
                  id={food._id}
                  name={food.name}
                  restaurant={food.restaurant?.name}
                  category={food.category}
                  price={food.price}
                  image={food.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"}
                  rating={food.rating}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <FadeContent>
          <MagicBento className="overflow-hidden">
            <div className="relative grid gap-8 p-10 md:grid-cols-2 md:items-center md:p-14">
              <div className="bg-dots-light absolute inset-0 opacity-40" />
              <div className="relative">
                <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">Ưu đãi hội viên</p>
                <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                  Giảm 10% đơn <span className="text-coral">đầu tiên</span> 🎉
                </h2>
                <p className="mt-3 max-w-md text-ink/60">
                  Đăng ký nhận mã giảm giá và không bỏ lỡ sản phẩm mới.
                </p>
              </div>
              <form className="relative flex w-full flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="flex-1 rounded-2xl border-2 border-ink bg-cream px-5 py-4 font-semibold shadow-chunky-sm outline-none placeholder:text-ink/40 focus:bg-white"
                />
                <SpecularButton type="submit">Đăng ký</SpecularButton>
              </form>
            </div>
          </MagicBento>
        </FadeContent>
      </section>
    </>
  );
}

export default Home;
