import React, { useEffect } from 'react';
import logo from '../assets/logo.svg';
import { useTranslation } from 'react-i18next';
import { useRide } from '../features/ride/rideContext';

interface LogoAndDriverInfoProps {
  showDriverInfo?: boolean; // Optional prop to show/hide driver info
  driverName: string;
  plateNumber: string;
  className?: string; // Optional className prop
}

const LogoAndDriverInfo: React.FC<LogoAndDriverInfoProps> = ({ driverName, plateNumber, className, showDriverInfo = true}) => {
  const { t } = useTranslation();
  const { language } = useRide();

  useEffect(() => {
    document.title = language === 'am' ? 'ሞቶ ስትሪት ፒክአፕ' : 'Moto Street Pickup';
  }, [language]);

  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      <img 
      src={logo} 
      alt="Logo" 
      className="w-[120px] h-[27.72px] md:w-[180px] md:h-[41.58px]" 
      />
      {showDriverInfo && (
      <div className="text-white text-center mt-4">
        <p className="text-lg font-normal">{t('rideWithDriver', { driverName: driverName.split(' ')[1] })}</p>
        <p className="text-gray-300">{t('-Plate')}: {plateNumber}</p>
      </div>
      )}
    </div>
  );
};

export default LogoAndDriverInfo;