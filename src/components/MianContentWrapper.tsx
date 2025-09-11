import React, { type ReactNode } from 'react';
import frame from '../assets/Frame.png'; // Make sure this path is correct

interface MainContentWrapperProps {
  children: ReactNode;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ children }) => {
  return (
    <div
      className="relative flex-[0.65] flex flex-col items-center justify-between px-4 sm:px-6 md:px-8"
      style={{
        backgroundImage: `url(${frame})`, // Replace '' with frame if you want to use the image
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'cover',
        background: 'linear-gradient(180deg, rgba(16, 19, 26, 1) 0%, rgba(16, 19, 32, 0) 11.44%), linear-gradient(180deg, rgb(16, 19, 26) , rgba(255, 255, 255, 1) 157.97%)',
        // mixBlendMode: 'luminosity'
      }}
    >
      <div className='flex flex-col items-center gap-12 w-full max-w-sm '>
        {children}
      </div>
    </div>
  );
};

export default MainContentWrapper;

