import { FaSearch } from "react-icons/fa";

function NavbarSearch() {
  return (
    <div className="relative hidden group lg:block">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
      <input
        type="text"
        placeholder="Tìm đồ chơi..."
        className="w-72 rounded-full border border-black/5 bg-white/80 py-2.5 pl-11 pr-4 font-semibold shadow-card outline-none transition placeholder:text-ink/40 focus:border-coral focus:bg-white focus:shadow-soft"
      />
    </div>
  );
}
export default NavbarSearch;
