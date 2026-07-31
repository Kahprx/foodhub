import { motion } from "framer-motion";
import { FaEye, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishListContext";

function FoodCard({ id, name, restaurant, price, image, category = "Toy", rating = 4.8, onQuickView, isComparing = false, onToggleCompare }) {
  const { addToCart } = useCart();
  const { wishlist, addWishlist, removeWishlist } = useWishlist();
  const food = { _id: id, name, restaurant, price, image, category, rating };
  const isFavorite = wishlist.some((item) => item._id === id);

  const onToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeWishlist(id);
        toast.info("Đã xóa món khỏi Wishlist.");
      } else {
        await addWishlist(id);
        toast.success("Đã thêm món vào Wishlist.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Vui lòng đăng nhập để dùng Wishlist.");
    }
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lift"
    >
      <Link to={`/foods/${id}`} className="block">
        <div className="relative overflow-hidden">
          <img src={image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"} alt={name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
          <button type="button" onClick={(event) => { event.preventDefault(); onToggleFavorite?.(id); }} className="absolute left-4 top-4 rounded-full bg-white/90 p-3 shadow-card backdrop-blur transition hover:scale-110" aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
            {isFavorite ? <FaHeart className="text-coral" /> : <FaRegHeart className="text-ink/50" />}
          </button>
          <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-sunny to-amber-300 px-3 py-1 font-display text-xs font-bold text-ink shadow-card">{category}</span>
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-3 bg-ink/75 py-3 font-display font-bold text-white backdrop-blur transition duration-300 group-hover:translate-y-0">
            <button type="button" onClick={(event) => { event.preventDefault(); onQuickView?.(food); }} className="flex items-center gap-2 hover:text-sunny"><FaEye /> Xem nhanh</button>
            <button type="button" onClick={(event) => { event.preventDefault(); onToggleCompare?.(food); }} className={`rounded-lg px-2 py-1 text-xs ${isComparing ? "bg-sunny text-ink" : "bg-white/20"}`}>{isComparing ? "Đã chọn" : "So sánh"}</button>
          </div>
        </div>
        <div className="p-6 pb-3">
          <h2 className="truncate text-xl font-bold">{name}</h2>
          <p className="mt-1 font-display text-xs font-bold uppercase tracking-wider text-teal">{category}</p>
          <div className="mt-2 flex items-center gap-2">
            <FaStar className="text-amber-400" />
            <span className="font-bold">{Number(rating).toFixed(1)}</span>
            <span className="truncate text-sm text-ink/50">• {restaurant?.name || restaurant || "HAPPYHOMES"}</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-coral">{Number(price).toLocaleString("vi-VN")}₫</p>
        </div>
      </Link>
      <div className="px-6 pb-6">
        <button type="button" onClick={() => addToCart(food, 1)} className="w-full rounded-full bg-coral px-4 py-3 font-display font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-coral/90 hover:shadow-soft active:translate-y-0 active:scale-[0.98]">Thêm vào giỏ</button>
      </div>
    </motion.article>
  );
}

export default FoodCard;
