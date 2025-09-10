import MainContentWrapper from '../components/MianContentWrapper';
import PrimaryButton from '../components/PrimaryButton';
import LogoAndDriverInfo from '../components/LogoAndDriverInfo';
import InputField from '../components/InputField';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Entry = () => {
  const navigate = useNavigate();
  const handleStartRide = () => {
    // navigate to AwaitingDriverConfirm page
    navigate('/awaiting');   
  };
  return (
    <MainContentWrapper>
      {/* Logo and Driver Info should take higher space */}
      <div className="flex items-center justify-center w-full mt-12">
        <LogoAndDriverInfo 
          className="flex flex-col items-center justify-center"
          driverName="Abebe"
          plateNumber="AB123556" 
        />
      </div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-8 flex-shrink-0">
        <InputField type="text" label="Name" />
        <InputField type="tel" label="Phone" />
      </div>

      {/* Buttons and Footer */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center gap-3 flex-shrink-0">
        <PrimaryButton title="Start Ride" onclick={handleStartRide}/>
        <Footer text="Powered by Moto street pickup" />
      </div>
    </MainContentWrapper>
  );
};

export default Entry;
