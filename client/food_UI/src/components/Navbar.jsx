import { useEffect, useState } from "react";
import NavbarSearch from "./Navbar/NavbarSearch";
import NavbarLogo from "./Navbar/NavbarLogo";
import NavbarMenu from "./Navbar/NavbarMenu";
import NavbarActions from "./Navbar/NavbarActions";
import MobileDrawer from "./Navbar/MobileDrawer";
import NavbarUser from "./Navbar/NavbarUser";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-3xl border px-4 transition-all duration-300 sm:px-6 ${
          isScrolled
            ? "border-black/5 bg-white/90 shadow-soft backdrop-blur-xl"
            : "border-white/70 bg-white/60 backdrop-blur-xl"
        }`}
      >
        <NavbarLogo />

        <NavbarSearch />

        <NavbarMenu />

        <NavbarUser />

        <ThemeToggle className="hidden sm:flex" />

        <NavbarActions onOpen={() => setOpen(true)} />
      </div>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </nav>
  );
}

export default Navbar;
