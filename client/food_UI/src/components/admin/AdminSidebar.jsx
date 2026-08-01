import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LineSidebar from "../bits/LineSidebar";

const menu = [
  { to: "/admin/dashboard", label: "Bảng điều khiển" },
  { to: "/admin/foods", label: "Sản phẩm" },
  { to: "/admin/orders", label: "Đơn hàng" },
  { to: "/admin/users", label: "Người dùng" },
  { to: "/admin/reviews", label: "Đánh giá" },
  { to: "/admin/coupons", label: "Mã giảm giá" },
  { to: "/admin/banners", label: "Banner" },
  { to: "/admin/categories", label: "Danh mục" },
  { to: "/admin/brands", label: "Thương hiệu" },
  { to: "/admin/reports", label: "Báo cáo" },
  { to: "/admin/settings", label: "Cài đặt" },
];

function AdminSidebar({ open = false, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeIndex = menu.findIndex((item) => pathname.startsWith(item.to));

  const handleItemClick = (index) => {
    navigate(menu[index]?.to);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose?.();
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-gradient-to-b from-slate-900 to-blue-950 p-6 text-white shadow-2xl transition-transform duration-300 md:static md:z-auto md:translate-x-0 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="mb-6 text-2xl font-bold">🧸 Bảng quản trị HAPPYHOMES</h2>

      <LineSidebar
        items={menu.map((item) => item.label)}
        onItemClick={handleItemClick}
        defaultActive={activeIndex}
        accentColor="#ffc94d"
        textColor="#c4c4c4"
        markerColor="#6c6c6c"
        showIndex={false}
        showMarker
        proximityRadius={140}
        maxShift={24}
        falloff="smooth"
        markerLength={48}
        markerGap={0}
        tickScale={0.5}
        scaleTick
        itemGap={16}
        fontSize={1.05}
        smoothing={120}
      />

      <div className="mt-10 space-y-2">
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full rounded-xl px-4 py-3 text-left text-gray-400 transition hover:bg-red-500/20 hover:text-red-300"
        >
          🚪 Đăng xuất
        </button>
      </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
