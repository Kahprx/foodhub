import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle";

const menus = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/menu" },
  { name: "Cart", path: "/cart" },
  { name: "Login", path: "/login" },
];

function MobileDrawer({ open, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-cream shadow-lift transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-sunny to-amber-300 p-6">
          <h2 className="font-display text-xl font-bold text-ink">🧸 HAPPYHOMES</h2>
          <button className="text-2xl text-ink transition hover:rotate-90" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <ul className="space-y-2 p-6">
          {menus.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 font-display font-bold transition-all ${
                    isActive
                      ? "bg-white text-ink shadow-card"
                      : "text-ink/70 hover:bg-sunny/40"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-black/5 px-6 py-5">
          <span className="font-display font-bold text-ink-soft">Giao diện</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
export default MobileDrawer;
