import { motion } from "framer-motion";

function SpecularButton({
  children,
  onClick,
  className = "",
  color = "bg-coral",
  disabled = false,
  type = "button",
}) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 0, scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-ink px-8 py-4 font-display text-lg font-bold text-white shadow-chunky transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-chunky-sm ${color} ${className} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
    </motion.button>
  );
}

export default SpecularButton;
