import MainContentWrapper from '../components/MianContentWrapper';
import LogoAndDriverInfo from '../components/LogoAndDriverInfo';
import Footer from '../components/Footer';
import Profile from '../assets/profile.svg';

const AwaitingDriverConfirm = () => {
  return (
    <MainContentWrapper>
      <LogoAndDriverInfo driverName="Abebe" plateNumber="AB123556" />

      {/* Form */}
      <div className="w-full max-w-sm space-y-8 mt-5">
        <div 
          className="flex flex-col items-center justify-center"
          // style={{
          //   borderRadius: '818.182px',
          //   border: '0.818px solid rgba(255, 255, 255, 0.10)',
          //   background: 'rgba(255, 255, 255, 0.05)',
          //   boxShadow: '0 0 24.304px 0 rgba(0, 0, 0, 0.06)',
          // }}
        >
          <img src={Profile} alt="Profile" className="h-20 w-20 m-4" />
          <div className="text-white text-center mb-4">
            <p className="text-lg sm:text-xl">Waiting for driver confirmation...</p>
          </div>
        </div>
      </div>

      <Footer text="Powered by Moto street pickup" />
    </MainContentWrapper>
  );
};

export default AwaitingDriverConfirm;