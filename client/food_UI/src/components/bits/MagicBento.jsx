import { motion } from "framer-motion";

function MagicBento({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`rounded-3xl border-2 border-ink bg-white shadow-chunky-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default MagicBento;
