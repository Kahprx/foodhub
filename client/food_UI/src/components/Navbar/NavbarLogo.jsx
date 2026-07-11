import { Link } from "react-router-dom";

function NavbarLogo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2 select-none"
    >
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center text-white text-lg shadow-md transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-orange-300">
        🍔
        <div className="absolute inset-0 rounded-xl bg-orange-400/30 blur-md opacity-0 transition-all duration-500 group-hover:opacity-100" />
      </div>

      <div className="leading-none">
        <h1 className="text-lg font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent tracking-wide transition-all duration-500 group-hover:tracking-wider">
          FoodHub
        </h1>
        <p className="text-[10px] text-gray-400 tracking-[2px] uppercase transition-all duration-500 group-hover:text-orange-400">
          Fast Delivery
        </p>
      </div>
    </Link>
  );
}
export default NavbarLogo;