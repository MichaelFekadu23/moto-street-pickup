import React, { type ReactNode } from 'react';
import frame from '../assets/Frame.png'; // Make sure this path is correct

interface MainContentWrapperProps {
  children: ReactNode;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ children }) => {
  return (
    <div
      className="relative flex-[0.7] flex flex-col items-center justify-between px-4 sm:px-6 md:px-8"
      style={{
        backgroundImage: `url(${frame})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'cover',
        background: 'linear-gradient(180deg, #0F141F 11.44%, rgba(0, 0, 0, 0.00) 157.97%)',
      }}
    >
      <div className='flex flex-col items-center gap-12 w-full max-w-sm h-11/12'>
        {children}
      </div>
    </div>
  );
};

export default MainContentWrapper;