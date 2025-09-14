import React, { type ReactNode } from 'react';
import frame from '../assets/Frame.png';

interface MainContentWrapperProps {
  children: ReactNode;
  /** Any valid CSS length, e.g. '2rem', '24px', '2.5rem' */
  gap?: string;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ children, gap }) => {
  return (
    <div
      className="relative flex-[1] flex flex-col items-center justify-between px-4 sm:px-6 md:px-8"
      style={{
        // Layer 1 (top): soft dark fade
        // Layer 2 (middle): long dark→light ramp
        // Layer 3 (bottom): your repeating frame image
         backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(16, 20, 28, 0.9) 0%,
            rgba(16, 20, 28, 0.6) 10%,
            rgba(16, 20, 28, 0.3) 22%,
            rgba(16, 20, 28, 0) 35%
          ),
          linear-gradient(
            180deg,
            rgba(16, 19, 26) 0%,
            rgba(16, 19, 26, 0.7) 40%,
            rgba(255, 255, 255, 1) 140%
          ),
          url(${frame})
        `,
        // One entry per layer (match the order above)
        backgroundRepeat: 'no-repeat, no-repeat, repeat-x',
        backgroundSize: 'cover, cover, auto',
        backgroundPosition: 'top left, top left, top left',
        // Optional: if you want the gradients to "mix" with the image differently:
        // backgroundBlendMode: 'normal, normal, normal',
      }}
    >
      {/* Using inline style for gap so you don't need Tailwind safelist for dynamic classes */}
      <div
        className="flex flex-col items-center w-full max-w-sm"
        style={{ gap: gap ?? '2.5rem' /* Tailwind gap-10 = 2.5rem */ }}
      >
        {children}
      </div>
    </div>
  );
};

export default MainContentWrapper;
