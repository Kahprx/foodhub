import { motion } from "framer-motion";

function TiltedCard({ children, className = "", intensity = 8 }) {
  return (
    <motion.div
      whileHover={{ rotateX: 8, rotateY: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default TiltedCard;
