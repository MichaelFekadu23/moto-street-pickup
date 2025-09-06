import React from 'react';
import logo from '../assets/logo.svg';

interface LogoAndDriverInfoProps {
  driverName: string;
  plateNumber: string;
  className?: string; // Optional className prop
}

const LogoAndDriverInfo: React.FC<LogoAndDriverInfoProps> = ({ driverName, plateNumber, className }) => {
  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      <img src={logo} alt="Logo" className="h-10 sm:h-12" />
      <div className="text-white text-center mt-4">
        <p className="text-lg sm:text-xl">You're riding with {driverName}</p>
        <p className="text-gray-300">-Plate: {plateNumber}</p>
      </div>
    </div>
  );
};

export default LogoAndDriverInfo;