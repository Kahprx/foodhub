import { useEffect, useState } from "react";
import NavbarSearch from "./Navbar/NavbarSearch";
import NavbarLogo from "./Navbar/NavbarLogo";
import NavbarMenu from "./Navbar/NavbarMenu";
import NavbarActions from "./Navbar/NavbarActions";
import MobileDrawer from "./Navbar/MobileDrawer";
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
    <nav
      className="group fixed top-0 left-0 w-full z-50 rounded-b-3xl overflow-hidden transition-all duration-300"
    >
      {/* Banner GIF */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/banner/f1c3fc727775a7378b32c4596e2e0ca2.gif"
          alt=""
          className="w-full h-full object-cover scale-110 blur-sm"
        />
        <div className="absolute inset-0 bg-white/70 group-hover:bg-white/40 backdrop-blur-xl border-b border-white/30 shadow-lg transition-all duration-500" />
      </div>

      <div className="relative container mx-auto h-16 px-6 flex justify-between items-center">

        <NavbarLogo />
        
        <NavbarSearch />

        <NavbarMenu />

        <NavbarActions onOpen={() => setOpen(true)} />

      </div>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />

    </nav>
  );
}

export default Navbar;