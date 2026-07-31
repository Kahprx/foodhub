import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaBalanceScale, FaChevronLeft, FaChevronRight, FaList, FaSearch, FaSpinner, FaTh, FaTimes } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import FoodCard from "../FoodCard";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const PAGE_SIZE = 12;
const DEFAULT_CATEGORIES = ["LEGO", "Action Figures", "Dolls", "RC Cars", "Educational Toys", "Plush Toys"];

function MenuSkeleton() {
  return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="h-56 animate-pulse bg-slate-200" /><div className="space-y-4 p-6"><div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" /><div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" /><div className="h-10 animate-pulse rounded-xl bg-slate-200" /></div></div>)}</div>;
}

function FoodList() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(searchParams.get("q") || "");
  const [categories, setCategories] = useState(() => searchParams.get("category")?.split(",").filter(Boolean) || []);
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(500000);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const [infinite, setInfinite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("foodhub-favorites") || "[]"));
  const [recentlyViewed, setRecentlyViewed] = useState(() => JSON.parse(localStorage.getItem("foodhub-recently-viewed") || "[]"));
  const [recommendations, setRecommendations] = useState([]);
  const [quickViewFood, setQuickViewFood] = useState(null);
  const [compareFoods, setCompareFoods] = useState([]);
  const [searchHistory, setSearchHistory] = useState(() => JSON.parse(localStorage.getItem("foodhub-search-history") || "[]"));
  const sentinel = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
      if (keyword.trim()) {
        setSearchHistory((current) => {
          const next = [keyword.trim(), ...current.filter((item) => item.toLowerCase() !== keyword.trim().toLowerCase())].slice(0, 5);
          localStorage.setItem("foodhub-search-history", JSON.stringify(next));
          return next;
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await api.get("/foods", { params: { limit: 100 } });
        setFoods(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải cửa hàng.");
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await api.get("/foods/recommendations", { params: { limit: 3 } });
        setRecommendations(response.data.data || []);
      } catch {
        // Recommendations are an enhancement; the menu itself remains usable without them.
      }
    }
    fetchRecommendations();
  }, []);

  useEffect(() => { localStorage.setItem("foodhub-favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => {
    const params = {};
    if (debouncedKeyword) params.q = debouncedKeyword;
    if (categories.length) params.category = categories.join(",");
    if (sort !== "newest") params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, categories, sort, setSearchParams]);

  useEffect(() => {
    if (!user) return;
    async function restoreAccountCollections() {
      try {
        const [favoriteResponse, recentResponse] = await Promise.all([api.get("/auth/favorites"), api.get("/auth/recently-viewed")]);
        setFavorites((favoriteResponse.data.data || []).map((food) => food._id));
        setRecentlyViewed(recentResponse.data.data || []);
      } catch {
        // Keep the local collections available if the account API is temporarily unavailable.
      }
    }
    restoreAccountCollections();
  }, [user]);

  const allCategories = useMemo(() => [...new Set([...DEFAULT_CATEGORIES, ...foods.map((food) => food.category).filter(Boolean)])], [foods]);
  const filteredFoods = useMemo(() => foods.filter((food) => {
    const name = (food.name || "").toLowerCase();
    const foodRating = Number(food.rating ?? 4.5);
    return name.includes(debouncedKeyword.trim().toLowerCase())
      && (!categories.length || categories.includes(food.category))
      && Number(food.price) <= price
      && foodRating >= rating;
  }).sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return Number(b.rating ?? 4.5) - Number(a.rating ?? 4.5);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  }), [foods, debouncedKeyword, categories, price, rating, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / PAGE_SIZE));
  const visibleCount = infinite ? page * PAGE_SIZE : PAGE_SIZE;
  const visibleFoods = infinite ? filteredFoods.slice(0, visibleCount) : filteredFoods.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (!infinite || !sentinel.current || visibleFoods.length >= filteredFoods.length) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage((current) => Math.min(current + 1, totalPages));
    }, { rootMargin: "240px" });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [infinite, visibleFoods.length, filteredFoods.length, totalPages]);

  const toggleCategory = (category) => { setPage(1); setCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]); };
  const toggleFavorite = async (id) => {
    const wasFavorite = favorites.includes(id);
    setFavorites((current) => wasFavorite ? current.filter((item) => item !== id) : [...current, id]);
    if (!user) return;
    try {
      const response = await api.patch(`/auth/favorites/${id}`);
      setFavorites(response.data.data || []);
    } catch {
      setFavorites((current) => wasFavorite ? [...current, id] : current.filter((item) => item !== id));
    }
  };
  const toggleCompare = (food) => setCompareFoods((current) => current.some((item) => item._id === food._id) ? current.filter((item) => item._id !== food._id) : current.length < 2 ? [...current, food] : [current[1], food]);
  const clearFilters = () => { setKeyword(""); setDebouncedKeyword(""); setCategories([]); setRating(0); setPrice(500000); setSort("newest"); setPage(1); };
  const chooseMode = (next) => { setInfinite(next); setPage(1); };

  if (loading) return <MenuSkeleton />;
  if (error) return <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">{error}</div>;

  return <>
    <div className="mb-6 flex flex-col gap-3 lg:flex-row">
      <label className="relative flex-1"><FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm theo tên đồ chơi..." className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/20" />{keyword !== debouncedKeyword && <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-coral" />}</label>
      <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-medium outline-none focus:border-coral" aria-label="Sắp xếp đồ chơi"><option value="newest">Mới nhất</option><option value="price-asc">Giá thấp → cao</option><option value="price-desc">Giá cao → thấp</option><option value="rating">Đánh giá cao nhất</option></select>
      <div className="flex rounded-2xl border border-slate-200 bg-white p-1"><button onClick={() => setView("grid")} className={`rounded-xl px-3 ${view === "grid" ? "bg-coral text-white" : "text-slate-500"}`} aria-label="Dạng lưới"><FaTh /></button><button onClick={() => setView("list")} className={`rounded-xl px-3 ${view === "list" ? "bg-coral text-white" : "text-slate-500"}`} aria-label="Dạng danh sách"><FaList /></button></div>
    </div>
    <div className="mb-7 flex flex-wrap gap-2"> <button onClick={() => { setCategories([]); setPage(1); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${!categories.length ? "bg-coral text-white" : "bg-white text-slate-600"}`}>All</button>{allCategories.map((category) => <button key={category} onClick={() => toggleCategory(category)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${categories.includes(category) ? "bg-coral text-white" : "bg-white text-slate-600 hover:bg-sunny/40"}`}>{category}</button>)}</div>
    {searchHistory.length > 0 && !keyword && <div className="mb-7 flex flex-wrap items-center gap-2 text-sm"><span className="text-slate-500">Tìm gần đây:</span>{searchHistory.map((item) => <button key={item} onClick={() => setKeyword(item)} className="rounded-full bg-white px-3 py-1.5 text-slate-600 transition hover:bg-sunny/40">{item}</button>)}</div>}
    <div className="grid gap-7 lg:grid-cols-[250px_1fr]">
      <aside className="h-fit rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 lg:sticky lg:top-24">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold">Bộ lọc</h2><button onClick={clearFilters} className="text-sm font-semibold text-coral">Xóa lọc</button></div>
        <p className="mb-3 text-sm font-bold text-slate-700">Danh mục</p><div className="space-y-2">{allCategories.map((category) => <label key={category} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"><input type="checkbox" checked={categories.includes(category)} onChange={() => toggleCategory(category)} className="h-4 w-4 accent-coral" />{category}</label>)}</div>
        <div className="my-6 border-t border-slate-100" /><div className="flex justify-between"><p className="text-sm font-bold text-slate-700">Giá tối đa</p><span className="text-sm font-semibold text-coral">{price.toLocaleString("vi-VN")}₫</span></div><input type="range" min="0" max="500000" step="10000" value={price} onChange={(event) => { setPrice(Number(event.target.value)); setPage(1); }} className="mt-4 w-full accent-coral" /><div className="mt-1 flex justify-between text-xs text-slate-400"><span>0₫</span><span>500k₫</span></div>
        <div className="my-6 border-t border-slate-100" /><p className="mb-3 text-sm font-bold text-slate-700">Đánh giá</p>{[5, 4, 3].map((value) => <label key={value} className="mb-2 flex cursor-pointer items-center gap-3 text-sm text-slate-600"><input type="radio" name="rating" checked={rating === value} onChange={() => { setRating(value); setPage(1); }} className="accent-coral" /><span className="text-yellow-400">★★★★★</span>{value < 5 && "+"}</label>)}<label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"><input type="radio" name="rating" checked={rating === 0} onChange={() => { setRating(0); setPage(1); }} className="accent-coral" />Tất cả đánh giá</label>
      </aside>
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-slate-500"><strong className="text-slate-900">{filteredFoods.length}</strong> món đồ chơi phù hợp</p><div className="rounded-xl bg-white p-1 text-sm"><button onClick={() => chooseMode(false)} className={`rounded-lg px-3 py-1.5 ${!infinite ? "bg-coral text-white" : "text-slate-500"}`}>Trang</button><button onClick={() => chooseMode(true)} className={`rounded-lg px-3 py-1.5 ${infinite ? "bg-coral text-white" : "text-slate-500"}`}>Tự cuộn</button></div></div>
        {visibleFoods.length === 0 ? <div className="rounded-3xl bg-white px-6 py-16 text-center"><span className="text-6xl">🧸</span><h3 className="mt-5 text-2xl font-bold">Không tìm thấy đồ chơi</h3><p className="mt-2 text-slate-500">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p><button onClick={clearFilters} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-coral"><FaTimes /> Xóa tất cả bộ lọc</button></div> : <motion.div layout className={view === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" : "grid grid-cols-1 gap-5"}><AnimatePresence>{visibleFoods.map((food) => <motion.div layout key={food._id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}><FoodCard {...food} id={food._id} rating={food.rating ?? 4.5} isFavorite={favorites.includes(food._id)} onToggleFavorite={toggleFavorite} onQuickView={setQuickViewFood} isComparing={compareFoods.some((item) => item._id === food._id)} onToggleCompare={toggleCompare} /></motion.div>)}</AnimatePresence></motion.div>}
        {infinite && <div ref={sentinel} className="py-8 text-center text-sm text-slate-400">{visibleFoods.length < filteredFoods.length ? "Đang tải thêm đồ chơi..." : filteredFoods.length > 0 ? "Bạn đã xem tất cả đồ chơi" : ""}</div>}
        {!infinite && filteredFoods.length > PAGE_SIZE && <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Phân trang"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-xl bg-white p-3 disabled:opacity-40"><FaChevronLeft /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button key={item} onClick={() => setPage(item)} className={`h-11 w-11 rounded-xl font-bold ${page === item ? "bg-coral text-white" : "bg-white text-slate-600"}`}>{item}</button>)}<button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-xl bg-white p-3 disabled:opacity-40"><FaChevronRight /></button></nav>}
        {recommendations.length > 0 && <section className="mt-16"><h2 className="text-2xl font-extrabold text-slate-900">Có thể bạn thích</h2><p className="mb-6 mt-1 text-slate-500">Gợi ý từ HAPPYHOMES dành cho bạn.</p><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{recommendations.map((food) => <FoodCard key={food._id} {...food} id={food._id} rating={food.rating ?? 4.5} isFavorite={favorites.includes(food._id)} onToggleFavorite={toggleFavorite} onQuickView={setQuickViewFood} isComparing={compareFoods.some((item) => item._id === food._id)} onToggleCompare={toggleCompare} />)}</div></section>}
        {recentlyViewed.length > 0 && <section className="mt-16"><h2 className="text-2xl font-extrabold text-slate-900">Đã xem gần đây</h2><p className="mb-6 mt-1 text-slate-500">Tiếp tục khám phá những món đồ chơi bạn vừa xem.</p><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{recentlyViewed.slice(0, 3).map((food) => <FoodCard key={food._id} {...food} id={food._id} rating={food.rating ?? 4.5} isFavorite={favorites.includes(food._id)} onToggleFavorite={toggleFavorite} onQuickView={setQuickViewFood} isComparing={compareFoods.some((item) => item._id === food._id)} onToggleCompare={toggleCompare} />)}</div></section>}
      </section>
    </div>
    {compareFoods.length > 0 && <aside className="fixed bottom-4 left-1/2 z-40 flex w-[min(95vw,580px)] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-slate-900 p-4 text-white shadow-2xl"><div><p className="flex items-center gap-2 font-bold"><FaBalanceScale /> So sánh đồ chơi ({compareFoods.length}/2)</p><p className="max-w-80 truncate text-sm text-slate-300">{compareFoods.map((food) => food.name).join(" · ")}</p></div><button onClick={() => compareFoods.length === 2 && setQuickViewFood({ compare: compareFoods })} disabled={compareFoods.length !== 2} className="rounded-xl bg-coral px-4 py-2 text-sm font-bold disabled:opacity-40">So sánh</button></aside>}
    <AnimatePresence>{quickViewFood && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setQuickViewFood(null)}><motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-extrabold">{quickViewFood.compare ? "So sánh đồ chơi" : "Xem nhanh"}</h2><button onClick={() => setQuickViewFood(null)} className="rounded-full bg-slate-100 p-2"><FaTimes /></button></div>{quickViewFood.compare ? <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr><th className="p-3 text-slate-500">Thông tin</th>{quickViewFood.compare.map((food) => <th key={food._id} className="p-3">{food.name}</th>)}</tr></thead><tbody>{[["Danh mục", "category"], ["Giá", "price"], ["Đánh giá", "rating"]].map(([label, field]) => <tr key={field} className="border-t"><td className="p-3 font-semibold text-slate-500">{label}</td>{quickViewFood.compare.map((food) => <td key={food._id} className="p-3">{field === "price" ? `${Number(food.price).toLocaleString("vi-VN")}₫` : food[field] ?? "—"}</td>)}</tr>)}</tbody></table></div> : <div className="grid gap-6 sm:grid-cols-2"><img src={quickViewFood.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"} alt={quickViewFood.name} className="h-60 w-full rounded-2xl object-cover" /><div><p className="text-sm font-bold text-coral">{quickViewFood.category}</p><h3 className="mt-1 text-2xl font-extrabold">{quickViewFood.name}</h3><p className="mt-3 text-slate-500">{quickViewFood.description || "Đồ chơi chất lượng được lựa chọn cho bé yêu của bạn."}</p><p className="mt-5 text-2xl font-extrabold text-coral">{Number(quickViewFood.price).toLocaleString("vi-VN")}₫</p></div></div>}</motion.div></motion.div>}</AnimatePresence>
  </>;
}

export default FoodList;
