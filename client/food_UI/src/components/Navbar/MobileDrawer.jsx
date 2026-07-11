import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const menus = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Cart", path: "/cart" },
  { name: "Login", path: "/login" },
];

function MobileDrawer({ open, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-orange-500">🍔 FoodHub</h2>
          <button className="text-2xl" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <ul className="p-6 space-y-5">
          {menus.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 transition-all duration-300 ${
                    isActive
                      ? "bg-orange-100 text-orange-500 font-bold"
                      : "hover:bg-orange-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
export default MobileDrawer;
