import { NavLink } from "react-router-dom";
import { FaHome, FaStore, FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function MobileBottomNav() {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const items = [
    { name: "Trang chủ", path: "/", icon: <FaHome /> },
    { name: "Cửa hàng", path: "/menu", icon: <FaStore /> },
    { name: "Giỏ hàng", path: "/cart", icon: <FaShoppingCart />, badge: cartCount },
    { name: "Hồ sơ", path: user ? "/profile" : "/login", icon: <FaUser /> },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-3 text-xs font-bold transition ${
                isActive ? "text-coral" : "text-gray-400"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
            {item.badge > 0 && (
              <span className="absolute right-1/4 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
