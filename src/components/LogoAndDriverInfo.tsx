import React from 'react';
import logo from '../assets/logo.svg';

interface LogoAndDriverInfoProps {
  showDriverInfo?: boolean; // Optional prop to show/hide driver info
  driverName: string;
  plateNumber: string;
  className?: string; // Optional className prop
}

const LogoAndDriverInfo: React.FC<LogoAndDriverInfoProps> = ({ driverName, plateNumber, className, showDriverInfo = true}) => {
  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      <img 
      src={logo} 
      alt="Logo" 
      className="w-[120px] h-[27.72px] md:w-[180px] md:h-[41.58px]" 
      />
      {showDriverInfo && (
      <div className="text-white text-center mt-4">
        <p className="text-lg font-normal">You're riding with {driverName}</p>
        <p className="text-gray-300">-Plate: {plateNumber}</p>
      </div>
      )}
    </div>
  );
};

export default LogoAndDriverInfo;