import { FaSearch } from "react-icons/fa";

function SearchBar() {
  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <div className="relative">
        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder="Tìm đồ chơi hoặc thương hiệu..."
          className="w-full rounded-full border border-black/5 bg-white py-4 pl-14 pr-4 font-semibold shadow-card outline-none transition placeholder:text-ink/40 focus:border-coral focus:shadow-soft"
        />
      </div>
    </div>
  );
}
export default SearchBar;
