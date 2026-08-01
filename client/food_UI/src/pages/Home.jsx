import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

function SectionTitle({ note, title, accent }) {
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

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 8, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date();
    target.setHours(23, 59, 59, 999);

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        target.setDate(target.getDate() + 1);
        return;
      }
      setTimeLeft({
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      {[
        { value: pad(timeLeft.h), label: "Giờ" },
        { value: pad(timeLeft.m), label: "Phút" },
        { value: pad(timeLeft.s), label: "Giây" },
      ].map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2">
          {idx > 0 && <span className="text-2xl font-bold text-coral">:</span>}
          <div className="rounded-xl bg-ink px-3 py-2 text-center shadow-card">
            <span className="font-display text-2xl font-bold text-white">{unit.value}</span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-ink/40">{unit.label}</span>
          </div>
        </div>
      ))}
    </div>
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

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-coral">Có lỗi xảy ra</h2>
        <p className="mt-4 text-ink/60">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-2xl bg-coral px-6 py-3 font-bold text-white transition hover:bg-coral/90"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}

function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async (attempt = 0) => {
    try {
      setError("");
      const [featuredRes, newRes, bestRes, flashRes] = await Promise.all([
        api.get("/foods?isFeatured=true&limit=6"),
        api.get("/foods?sort=new&limit=6"),
        api.get("/foods?sort=sold&limit=3"),
        api.get("/foods?onSale=true&limit=4"),
      ]);
      setFeatured(featuredRes.data.data || []);
      setNewArrivals(newRes.data.data || []);
      setBestSellers(bestRes.data.data || []);
      setFlashSale(flashRes.data.data || []);
    } catch (err) {
      console.error(err);
      // Retry để đi qua Railway cold start (backend ngủ cần vài chục giây để wake)
      if (attempt < 2) {
        setTimeout(() => fetchAll(attempt + 1), 5000);
      } else {
        setError("Không tải được danh sách đồ chơi.");
      }
    } finally {
      if (attempt >= 2) setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      setSubscribing(true);
      await api.post("/subscribers", { email: email.trim() });
      toast.success("Đăng ký nhận tin thành công! 🎉");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => fetchAll()} />;

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

      {flashSale.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-r from-red-600 via-coral to-amber-500 py-16">
          <div className="bg-dots-light absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-widest text-white/80">Chớp nhoáng</p>
                <h2 className="mt-2 text-4xl font-bold text-white">
                  FLASH <span className="text-ink">SALE</span> ⚡
                </h2>
              </div>
              <CountdownTimer />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {flashSale.map((food) => (
                <FoodCard
                  key={food._id}
                  id={food._id}
                  name={food.name}
                  restaurant={food.restaurant?.name}
                  category={food.category}
                  price={food.price}
                  discountPrice={food.discountPrice}
                  image={food.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"}
                  rating={food.rating}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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
                discountPrice={food.discountPrice}
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
                  discountPrice={food.discountPrice}
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
                  discountPrice={food.discountPrice}
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
              <form onSubmit={handleSubscribe} className="relative flex w-full flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="flex-1 rounded-2xl border-2 border-ink bg-cream px-5 py-4 font-semibold shadow-chunky-sm outline-none placeholder:text-ink/40 focus:bg-white"
                />
                <SpecularButton type="submit" disabled={subscribing}>
                  {subscribing ? "Đang đăng ký..." : "Đăng ký"}
                </SpecularButton>
              </form>
            </div>
          </MagicBento>
        </FadeContent>
      </section>
    </>
  );
}

export default Home;
