import { motion } from "framer-motion";

function SpecularButton({
  children,
  onClick,
  className = "",
  color = "bg-coral",
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.97 }}
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-ink px-8 py-4 font-display text-lg font-bold text-white shadow-chunky transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-chunky-sm ${color} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
    </motion.button>
  );
}

export default SpecularButton;
