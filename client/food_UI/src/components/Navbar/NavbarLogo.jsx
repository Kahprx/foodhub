import { Link } from "react-router-dom";

function NavbarLogo() {
  return (
    <Link to="/" className="group flex select-none items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sunny to-amber-300 text-xl shadow-card ring-1 ring-black/5 transition-transform duration-300 group-hover:-rotate-6">
        🧸
      </div>

      <div className="leading-none">
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">
          HAPPYHOMES
        </h1>
        <p className="mt-0.5 font-display text-[10px] font-bold uppercase tracking-[3px] text-teal">
          Toy Store
        </p>
      </div>
    </Link>
  );
}
export default NavbarLogo;
