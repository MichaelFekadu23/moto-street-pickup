// RippleAvatar.tsx
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Profile from '../assets/profile-pic.svg';

interface RippleProps {
  photoUrl?: string;
  delay?: number;
}

function Ripple({ delay = 0 }: RippleProps) {
  return (
    <motion.span
      className="absolute inset-0 rounded-full ring-2 ring-white/20 pointer-events-none"
      initial={{ scale: 0.9, opacity: 0.5 }}
      animate={{ scale: 2.1, opacity: 0 }}
      transition={{ duration: 2.0, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.3, delay }}
    />
  );
}

export default function RippleAvatar({ photoUrl }: RippleProps) {
  const prefersReduced = useReducedMotion();

  // Start with provided url, fall back to placeholder on failure
  const [src, setSrc] = useState<string>(photoUrl || Profile);

  // If the incoming url changes (e.g., new driver), reset the src
  useEffect(() => {
    setSrc(photoUrl || Profile);
  }, [photoUrl]);

  const handleError = () => {
    // Guard to avoid infinite loop if placeholder also errors
    if (src !== Profile) setSrc(Profile);
  };

  return (
    <div className="relative h-36 w-36 flex items-center justify-center overflow-visible">
      {/* Static shadow rings (subtle) */}
      <span className="absolute h-[85%] w-[85%] rounded-full border bg-white/10 border-white/10" />
      <span className="absolute h-[115%] w-[115%] rounded-full border bg-white/10 border-white/10" />

      {/* Animated ripples (staggered) */}
      {!prefersReduced && (
        <>
          <Ripple delay={0} />
          <Ripple delay={0.5} />
        </>
      )}

      {/* Avatar */}
      <img
        src={src}
        onError={handleError}
        alt="Profile"
        className="relative z-10 h-20 w-20 rounded-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
