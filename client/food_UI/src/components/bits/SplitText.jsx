import { motion } from "framer-motion";

function SplitText({ text, className = "", delay = 0, perWord = false }) {
  const parts = perWord ? text.split(" ") : text.split("");

  return (
    <span className={className} aria-label={text}>
      {parts.map((part, index) => (
        <motion.span
          key={index}
          className={perWord ? "inline-block whitespace-nowrap" : "inline-block"}
          initial={{ opacity: 0, y: 24, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: delay + index * (perWord ? 0.09 : 0.025),
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {part}
          {!perWord && "\u00A0" === " " ? "\u00A0" : perWord ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

export default SplitText;
