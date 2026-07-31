import { motion } from "framer-motion";

function AnimatedList({ items, render, className = "" }) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <motion.div
          key={item._id || index}
          layout
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 120 }}
          transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
        >
          {render(item, index)}
        </motion.div>
      ))}
    </div>
  );
}

export default AnimatedList;
