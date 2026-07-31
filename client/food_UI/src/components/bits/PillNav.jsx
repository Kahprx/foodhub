import { NavLink } from "react-router-dom";

function PillNav({ items, className = "" }) {
  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `rounded-xl border-2 px-4 py-2 font-display text-sm font-bold transition-all ${
              isActive
                ? "border-ink bg-sunny text-ink shadow-chunky-sm"
                : "border-transparent text-ink/70 hover:bg-sunny/40 hover:text-ink"
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default PillNav;
