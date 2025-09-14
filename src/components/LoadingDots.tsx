import { motion } from "framer-motion";

export const LoadingDots = () => {
  const dot = {
    initial: { scale: 0.6, opacity: 0.5 },
    animate: { scale: 1, opacity: 1 },
  };

  return (
    <div className="flex py-1.5 items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-2 w-2 rounded-full bg-white"
          variants={dot}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};
