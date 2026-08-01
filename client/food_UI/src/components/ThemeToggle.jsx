import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle({ className = "" }) {
  const { dark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Chuyển giao diện sáng" : "Chuyển giao diện tối"}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-white/80 text-ink shadow-card transition hover:bg-sunny/40 hover:shadow-soft ${className}`}
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;
