import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const adminLinks = [
  { to: "/admin/dashboard", label: "Bảng điều khiển" },
  { to: "/admin/foods", label: "Sản phẩm" },
  { to: "/admin/orders", label: "Đơn hàng" },
  { to: "/admin/users", label: "Người dùng" },
];

function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-3xl border border-black/5 bg-white/95 px-4 shadow-soft backdrop-blur-xl sm:px-6">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sunny to-amber-300 text-xl shadow-card ring-1 ring-black/5">
            🧸
          </div>
          <div className="leading-none">
            <h1 className="font-display text-lg font-bold tracking-tight text-ink">HAPPYHOMES</h1>
            <p className="mt-0.5 font-display text-[10px] font-bold uppercase tracking-[3px] text-teal">Bảng quản trị</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {adminLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 font-display text-sm font-bold transition ${
                  isActive ? "bg-coral text-white shadow-card" : "text-ink/70 hover:bg-sunny/40"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/" className="hidden font-display text-sm font-bold text-ink/70 transition hover:text-coral md:block">
            Xem cửa hàng
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1.5 shadow-card">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="hidden text-left xl:block">
              <p className="text-sm leading-tight">{user?.fullName}</p>
              <p className="text-[11px] text-ink/50">
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
      </div>
    </nav>
  );
}

export default AdminNavbar;
