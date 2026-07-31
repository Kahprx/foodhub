import { motion } from "framer-motion";

function LogoLoop({ logos, className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent" />
      <div className="flex w-max items-center gap-12">
        {[0, 1].map((copy) => (
          <motion.div
            key={copy}
            className="flex items-center gap-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {logos.map((logo, index) => (
              <span
                key={index}
                className="flex items-center gap-3 font-display text-xl font-bold text-ink/40"
              >
                {logo}
                <span className="h-2 w-2 rounded-full bg-coral" />
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LogoLoop;
