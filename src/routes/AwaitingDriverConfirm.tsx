import MainContentWrapper from '../components/MianContentWrapper';
import LogoAndDriverInfo from '../components/LogoAndDriverInfo';
import Footer from '../components/Footer';
import RippleAvatar from '../components/RippleAvatar';

const AwaitingDriverConfirm = () => {
  return (
    <MainContentWrapper>        
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
        <RippleAvatar />
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
    </MainContentWrapper>
  );
};

export default AwaitingDriverConfirm;
