import { FaBars } from "react-icons/fa";

function NavbarActions({ onOpen }) {
  return (
    <button
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 bg-white/80 text-xl shadow-card transition hover:shadow-soft md:hidden"
      onClick={onOpen}
    >
      <FaBars />
    </button>
  );
}
export default NavbarActions;
