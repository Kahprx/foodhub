import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishListContext";

function Wishlist() {
  const { wishlist, removeWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = async (id) => {
    try {
      await removeWishlist(id);
      toast.info("Đã xóa món khỏi Wishlist.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể xóa món khỏi Wishlist.");
    }
  };

  return (
    <section className="mx-auto min-h-screen max-w-6xl px-6 pt-28 pb-24">
      <h1 className="mb-8 font-display text-3xl font-bold">❤️ Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          <p>Bạn chưa có món đồ chơi yêu thích.</p>
          <Link to="/menu" className="mt-5 inline-block font-bold text-coral hover:underline">
            Khám phá cửa hàng
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <article key={item._id} className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <img
                src={item.image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"}
                alt={item.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="mt-2 font-bold text-coral">
                  {Number(item.price).toLocaleString("vi-VN")}₫
                </p>

                <div className="mt-5 flex gap-3">
                  <button type="button" onClick={() => handleRemove(item._id)} className="flex-1 rounded-full bg-red-500 py-3 text-white transition hover:bg-red-600">
                    Xóa
                  </button>
                  <button type="button" onClick={() => addToCart(item, 1)} className="flex-1 rounded-full bg-teal py-3 text-white transition hover:bg-teal/90">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
