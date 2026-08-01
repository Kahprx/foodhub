import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishListContext";

function NavbarUser() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="hidden items-center gap-3 lg:flex">
        <Link to="/login" className="font-display font-bold text-ink/70 transition hover:text-coral">
          Đăng nhập
        </Link>
        <Link
          to="/register"
          className="rounded-full bg-coral px-5 py-2 font-display font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  const closeMenu = () => setOpen(false);

  return (
    <div className="relative hidden items-center lg:flex">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-3 rounded-full border border-black/5 bg-white/80 px-3 py-1.5 font-display font-bold shadow-card transition hover:shadow-soft"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
          {user.fullName.charAt(0).toUpperCase()}
        </div>

        <div className="hidden text-left xl:block">
          <p className="text-sm leading-tight">{user.fullName}</p>
          <p className="text-[11px] text-ink/50">{user.role}</p>
        </div>

        <span className={`text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lift"
        >
          <div className="border-b border-black/5 bg-sunny/20 p-5">
            <h3 className="font-display font-bold">{user.fullName}</h3>
            <p className="text-sm text-ink/50">{user.email}</p>
          </div>

          <Link to="/orders" onClick={closeMenu} className="block px-5 py-3 font-bold transition hover:bg-sunny/30">
            📦 Đơn hàng
          </Link>
          <Link to="/wishlist" onClick={closeMenu} className="block px-5 py-3 font-bold transition hover:bg-sunny/30">
            {wishlist.length > 0 && <span className="mr-2 rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white">{wishlist.length}</span>}
            ❤️ Yêu thích
          </Link>
          <Link to="/profile" onClick={closeMenu} className="block px-5 py-3 font-bold transition hover:bg-sunny/30">
            ⚙️ Hồ sơ
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              closeMenu();
            }}
            className="w-full border-t border-black/5 px-5 py-3 text-left font-bold text-red-500 transition hover:bg-red-50"
          >
            🚪 Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default NavbarUser;
