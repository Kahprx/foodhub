import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import AdminNotifications from "./AdminNotifications";
import ThemeToggle from "../ThemeToggle";

const titles = {
  "/admin/dashboard": "Bảng điều khiển",
  "/admin/foods": "Quản lý sản phẩm",
  "/admin/orders": "Quản lý đơn hàng",
  "/admin/users": "Quản lý người dùng",
};

function AdminHeader({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const title =
    Object.entries(titles).find(([key]) => pathname.startsWith(key))?.[1] ||
    "Quản trị HAPPYHOMES";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 bg-white px-4 py-4 sm:px-8 sm:py-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Mở menu"
          className="rounded-xl border border-black/5 bg-cream p-2.5 text-ink transition hover:bg-sunny/40 md:hidden"
        >
          <FaBars />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">{title}</h1>
          <p className="hidden text-sm text-ink-soft sm:block">Quản trị cửa hàng HAPPYHOMES</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <AdminNotifications />
        <ThemeToggle />
        <Link to="/" className="hidden text-sm font-bold text-ink-soft transition hover:text-coral sm:block">
          Xem cửa hàng
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-black/5 bg-cream px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-sm leading-tight font-bold">{user?.fullName || "Quản trị viên"}</p>
            <p className="text-[11px] text-ink-soft">
              {user?.role === "admin"
                ? "Quản trị viên"
                : user?.role === "customer"
                ? "Khách hàng"
                : user?.role === "restaurant"
                ? "Nhà hàng"
                : user?.role}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full bg-coral px-4 py-2 font-display text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
