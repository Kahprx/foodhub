import { motion } from "framer-motion";

function GlassIcon({ children, className = "", glow = "bg-blue-500/20" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/60 bg-white/50 text-4xl text-blue-600 shadow-lg backdrop-blur-xl transition-colors duration-300 ${className}`}
    >
      <div className={`pointer-events-none absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${glow}`} />
      {children}
    </motion.div>
  );
}

export default GlassIcon;
