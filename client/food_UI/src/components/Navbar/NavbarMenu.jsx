import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const menus = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Cart", path: "/cart" },
  { name: "Login", path: "/login" },
];

function NavbarMenu() {
  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <ul className="hidden lg:flex items-center gap-10">
      {menus.map((item) => {
        const active = hovered === item.path;
        const isClicked = clicked === item.path;

        return (
          <li
            key={item.path}
            className="relative"
            onMouseEnter={() => setHovered(item.path)}
            onMouseLeave={() => {
              setHovered(null);
              setMousePos({ x: 50, y: 50 });
            }}
          >
            <motion.div
              animate={{ y: active ? -2 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
            <NavLink
              to={item.path}
              onClick={() => {
                setClicked(item.path);
                setTimeout(() => setClicked(null), 500);
              }}
              onMouseMove={handleMouseMove}
              className="
                relative px-6 py-2 rounded-full font-semibold
                z-10 block overflow-hidden
                transition-colors duration-300 group
              "
            >
              {/* Animated Pill */}
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                  }}
                  className="
                    absolute inset-0 rounded-full
                    bg-gradient-to-r from-orange-100 to-amber-50
                    shadow-lg shadow-orange-200/30
                  "
                  animate={
                    isClicked
                      ? {
                          scale: [1, 1.08, 0.94, 1.02, 1],
                          boxShadow: [
                            "0 10px 15px -3px rgba(251,146,60,0.2)",
                            "0 25px 30px -5px rgba(251,146,60,0.5)",
                            "0 10px 15px -3px rgba(251,146,60,0.2)",
                          ],
                        }
                      : { scale: 1 }
                  }
                  transition={
                    isClicked
                      ? { duration: 0.5, ease: "easeInOut" }
                      : { type: "spring", stiffness: 300, damping: 30, mass: 0.8 }
                  }
                >
                  {/* Glow follows pill */}
                  <div className="absolute -inset-4 rounded-full bg-orange-400/15 blur-2xl -z-10" />
                </motion.div>
              )}

              {/* Cursor Follow Glow */}
              {active && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(110px circle at ${mousePos.x}% ${mousePos.y}%, rgba(251,146,60,0.3), transparent)`,
                  }}
                />
              )}

              {/* Text */}
              <motion.span
                className="relative z-10 inline-block"
                animate={{
                  scale: active ? 1.05 : 1,
                  color: active ? "#ea580c" : "#374151",
                  textShadow: active
                    ? "0 0 20px rgba(251,146,60,0.35)"
                    : "0 0 0px transparent",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                {item.name}
              </motion.span>

              {/* Blur behind */}
              {active && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-full backdrop-blur-[2px] -z-10"
                />
              )}
            </NavLink>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}

export default NavbarMenu;
