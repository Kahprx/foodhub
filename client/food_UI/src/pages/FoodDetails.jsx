import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../services/api";
import FoodCard from "../components/FoodCard";
import FoodSkeleton from "../components/FoodSkeleton";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishListContext";

function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReview, setLoadingReview] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { wishlist, addWishlist, removeWishlist } = useWishlist();

  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReview(true);
      setReviewError("");
      const response = await api.get("/reviews", { params: { foodId: id, limit: 20 } });
      setReviews(response.data.data || []);
    } catch (requestError) {
      setReviewError(requestError.response?.data?.message || "Không thể tải đánh giá.");
      setReviews([]);
    } finally {
      setLoadingReview(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/foods/${id}`);
        const currentFood = response.data.data;
        setFood(currentFood);

        const recent = JSON.parse(localStorage.getItem("foodhub-recently-viewed") || "[]")
          .filter((item) => item._id !== currentFood._id)
          .slice(0, 7);
        localStorage.setItem("foodhub-recently-viewed", JSON.stringify([currentFood, ...recent]));
        if (user) api.post(`/auth/recently-viewed/${currentFood._id}`).catch(() => {});

        if (currentFood.category) {
          const relatedResponse = await api.get("/foods", { params: { category: currentFood.category } });
          setRelatedFoods((relatedResponse.data.data || []).filter((item) => item._id !== currentFood._id));
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Không thể tải đồ chơi.");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const isFavorite = food ? wishlist.some((item) => item._id === food._id) : false;
  const average = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const toggleWishlist = async () => {
    try {
      if (isFavorite) {
        await removeWishlist(food._id);
        toast.info("Đã xóa món khỏi Wishlist.");
      } else {
        await addWishlist(food._id);
        toast.success("Đã thêm món vào Wishlist.");
      }
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Vui lòng đăng nhập để dùng Wishlist.");
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.info("Vui lòng đăng nhập để gửi đánh giá.");
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post("/reviews", { foodId: id, rating: Number(reviewRating), comment: reviewComment });
      setReviewRating(5);
      setReviewComment("");
      await fetchReviews();
      toast.success("Đã gửi đánh giá.");
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Không thể gửi đánh giá.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <FoodSkeleton />;
  if (error) return <div className="flex h-screen items-center justify-center"><h2 className="text-2xl font-bold text-red-500">{error}</h2></div>;
  if (!food) return <div className="flex h-screen items-center justify-center"><h2 className="text-2xl font-bold">Không tìm thấy đồ chơi</h2></div>;

  return (
    <section className="container mx-auto px-4 pt-28 pb-24 sm:px-6 lg:px-8 lg:pt-32">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
          <img src={food.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1000"} alt={food.name} className="max-h-[550px] w-full rounded-3xl object-cover shadow-lift transition-all duration-500 hover:scale-105" />
          <button type="button" onClick={toggleWishlist} className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110" aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
            {isFavorite ? <FaHeart className="text-xl text-red-500" /> : <FaRegHeart className="text-xl text-slate-500" />}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <h1 className="text-3xl font-extrabold md:text-4xl lg:text-5xl">{food.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex gap-0.5 text-lg text-yellow-400">{[...Array(5)].map((_, index) => <FaStar key={index} />)}</span>
            <span className="text-gray-500">{average} ({reviews.length} đánh giá)</span>
          </div>
          <div className="mt-8"><p className="text-gray-500">Thương hiệu</p><h3 className="mt-2 text-2xl font-bold">{food.restaurant?.name || "HAPPYHOMES"}</h3></div>
          <div className="mt-8"><p className="text-gray-500">Giá</p><h2 className="mt-2 text-3xl font-bold text-coral md:text-4xl">{Number(food.price).toLocaleString("vi-VN")}₫</h2></div>
          <div className="mt-8"><h3 className="text-2xl font-bold">Mô tả</h3><p className="mt-3 leading-8 text-gray-600">{food.description || "Đồ chơi chất lượng cao, an toàn cho trẻ em, mang lại niềm vui cho cả gia đình."}</p></div>

          <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="h-12 w-12 rounded-xl bg-gray-100 transition-all hover:bg-gray-200">-</motion.button>
            <motion.span key={quantity} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-8 text-center text-2xl font-bold">{quantity}</motion.span>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setQuantity((current) => current + 1)} className="h-12 w-12 rounded-xl bg-coral text-white transition-all hover:bg-coral/90">+</motion.button>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToCart(food, quantity)} className="mt-10 w-full rounded-2xl bg-coral px-8 py-4 text-lg font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral/90 hover:shadow-soft sm:w-auto">🛒 Thêm vào giỏ hàng</motion.button>
        </motion.div>
      </div>

      <motion.section className="mt-24" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Đánh giá sản phẩm</h2>
            <p className="mt-2 text-gray-500">
              {reviews.length} đánh giá · Trung bình {average}/5
            </p>
          </div>
          <div className="rounded-2xl bg-sunny/30 px-5 py-3 text-2xl font-extrabold text-coral">
            {average} <FaStar className="inline text-lg" />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {loadingReview ? <div className="rounded-3xl bg-white p-8 text-center text-gray-500"><span className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-coral border-t-transparent" /> <p className="mt-3">Đang tải đánh giá...</p></div> : reviewError ? <div className="rounded-3xl bg-red-50 p-6 text-red-600">{reviewError}</div> : reviews.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-card">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá món đồ chơi này.</div> : reviews.map((review) => <article key={review._id} className="rounded-3xl bg-white p-6 shadow-card"><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold">{review.user?.fullName || "Khách hàng HAPPYHOMES"}</h3><p className="mt-1 text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</p></div><span className="flex items-center gap-1 font-bold text-coral"><FaStar /> {Number(review.rating).toFixed(1)}</span></div>{review.comment && <p className="mt-4 leading-7 text-gray-600">{review.comment}</p>}</article>)}
          </div>

          <form onSubmit={submitReview} className="h-fit rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 lg:sticky lg:top-24">
            <h3 className="text-xl font-bold">Gửi đánh giá</h3>

            {!user && (
              <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-500 text-center">
                Bạn cần đăng nhập để đánh giá.
              </p>
            )}

            <label className="mt-5 block text-sm font-semibold">Số sao</label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={!user}
                  onMouseEnter={() => !user || setHoveredStar(star)}
                  onMouseLeave={() => !user || setHoveredStar(0)}
                  onClick={() => !user || setReviewRating(star)}
                  className={`text-2xl transition ${!user ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:scale-110"}`}
                >
                  {star <= (hoveredStar || reviewRating) ? "★" : "☆"}
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-400 self-center">{reviewRating} sao</span>
            </div>

            <label className="mt-5 block text-sm font-semibold">Nhận xét</label>
            <textarea
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              maxLength="1000"
              rows="5"
              disabled={!user}
              placeholder={user ? "Chia sẻ trải nghiệm của bạn..." : "Đăng nhập để viết đánh giá..."}
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-coral disabled:bg-gray-50 disabled:text-gray-400"
            />

            <button
              type="submit"
              disabled={submittingReview || !user}
              className="mt-5 w-full rounded-xl bg-teal py-3 font-bold text-white transition hover:bg-teal/90 disabled:cursor-not-allowed disabled:bg-teal/50"
            >
              {submittingReview ? "Gửi đánh giá..." : "Gửi đánh giá"}
            </button>
          </form>
        </div>
      </motion.section>

      <motion.section className="mt-24" initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="mb-10 text-3xl font-bold">Bạn cũng có thể thích</h2>
        {relatedFoods.length === 0 ? <p className="text-lg text-gray-500">🧸 Chưa có đồ chơi liên quan</p> : <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">{relatedFoods.map((item) => <FoodCard key={item._id} id={item._id} name={item.name} restaurant={item.restaurant?.name} price={item.price} image={item.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"} />)}</div>}
      </motion.section>
    </section>
  );
}

export default FoodDetail;
