// RippleAvatar.tsx
import { motion, useReducedMotion } from 'framer-motion';
import Profile from '../assets/profile-pic.png';

function Ripple({ delay = 0 }) {
  return (
    <motion.span
      className="absolute inset-0 rounded-full ring-2 ring-white/20 pointer-events-none"
      initial={{ scale: 0.9, opacity: 0.5 }}
      animate={{ scale: 2.1, opacity: 0 }}
      transition={{
        duration: 2.4,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 0.4,
        delay,
      }}
    />
  );
}

export default function RippleAvatar() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative h-36 w-36 flex items-center justify-center overflow-visible">
      {/* Static shadow rings (subtle) */}
      <span className="absolute h-[90%] w-[90%] rounded-full border bg-white/10 border-white/10"></span>
      <span className="absolute h-[120%] w-[120%] rounded-full border bg-white/10 border-white/10"></span>

      {/* Animated ripples (staggered) */}
      {!prefersReduced && (
        <>
          <Ripple delay={0} />
          <Ripple delay={0.5} />
        </>
      )}

      {/* Avatar */}
      <img
        src={Profile}
        alt="Profile"
        className="relative z-10 h-20 w-20 rounded-full object-cover"
      />
    </div>
  );
}
