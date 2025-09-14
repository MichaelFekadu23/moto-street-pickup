import React, { type ReactNode } from 'react';
import frame from '../assets/Frame.png'; // Make sure this path is correct

interface MainContentWrapperProps {
  children: ReactNode;
  gap?: string; // Optional gap prop
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ children, gap }) => {
  return (
    <div
      className="relative flex-[1] flex flex-col items-center justify-between px-4 sm:px-6 md:px-8"
      style={{
        backgroundImage: `url(${frame})`, // Replace '' with frame if you want to use the image
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'cover',
        background: 'linear-gradient(to bottom, rgba(16, 20, 29, 0.9), rgba(16, 20, 28, 0) 30%), linear-gradient(180deg, rgb(16, 19, 26) , rgba(255, 255, 255, 1) 165%)',
        // mixBlendMode: 'luminosity'
      }}
    >
      <div className={`flex flex-col items-center w-full max-w-sm ${gap ? `gap-${gap}` : 'gap-10'}`}>
        {children}
      </div>
    </div>
  );
};

export default MainContentWrapper;

