import MainContentWrapper from '../components/MianContentWrapper';
import PrimaryButton from '../components/PrimaryButton';
import LogoAndDriverInfo from '../components/LogoAndDriverInfo';
import InputField from '../components/InputField';
import Footer from '../components/Footer';

const Entry = () => {
  return (
    <MainContentWrapper>
      {/* Logo and Driver Info should take higher space */}
      <div className="flex flex-grow items-center justify-center w-full">
        <LogoAndDriverInfo 
          className="flex flex-col items-center justify-center"
          driverName="Abebe"
          plateNumber="AB123556" 
        />
      </div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-8 flex-shrink-0">
        <InputField type="text" placeholder="Name ______" />
        <InputField type="tel" placeholder="Phone ______" />
      </div>

      {/* Buttons and Footer */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center gap-3 flex-shrink-0">
        <PrimaryButton title="Start Ride" />
        <Footer text="Powered by Moto street pickup" />
      </div>
    </MainContentWrapper>
  );
};

export default Entry;
