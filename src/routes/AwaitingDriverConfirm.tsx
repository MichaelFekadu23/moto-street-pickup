import MainContentWrapper from '../components/MianContentWrapper';
import LogoAndDriverInfo from '../components/LogoAndDriverInfo';
import Footer from '../components/Footer';
import Profile from '../assets/profile-pic.png';

const AwaitingDriverConfirm = () => {
  return (
    <MainContentWrapper>
      <div className="flex flex-col w-full h-full">
        
        {/* Logo + Driver Info */}
        <div className="flex basis-2/5 items-center justify-center w-full">
          <LogoAndDriverInfo 
            className="flex flex-col items-center justify-center"
            driverName="Abebe"
            plateNumber="AB123556" 
          />
        </div>

        {/* Profile + Awaiting Message */}
        <div className="flex flex-col items-center justify-start flex-grow">
          <img src={Profile} alt="Profile" className="h-20 w-20 m-4" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-white text-center">
            <p className="font-semibold text-[20px] uppercase">
              AWAITING DRIVER
            </p>
            <p className="font-semibold text-[20px] uppercase">
              CONFIRMATION!
            </p>
          </div>

          {/* Footer stays at bottom */}
          <div className="mt-auto">
            <Footer text="Powered by Moto street pickup" />
          </div>
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default AwaitingDriverConfirm;
