import { motion } from "framer-motion";

function Aurora({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-16 h-96 w-96 rounded-full bg-blue-400/40 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -70, 40, 0], y: [0, 40, -60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-0 h-80 w-80 rounded-full bg-purple-400/40 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 50, -60, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-300/40 blur-3xl"
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default Aurora;
