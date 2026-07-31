import { motion } from "framer-motion";

function BorderGlow({ children, className = "", gradient = "from-blue-500 via-purple-500 to-amber-400" }) {
  return (
    <div className={`group relative rounded-3xl ${className}`}>
      <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r opacity-60 blur-sm transition-opacity duration-300 group-hover:opacity-100 ${gradient}`} />
      <div className="relative rounded-3xl bg-white p-6">{children}</div>
    </div>
  );
}

export default BorderGlow;
