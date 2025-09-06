import MainContentWrapper from '../components/MianContentWrapper';
import PrimaryButton from '../components/PrimaryButton';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';

const Entry = () => {
  return (
    <MainContentWrapper>
      {/* Logo and Driver Info should take higher space */}
      <div className="flex flex-col basis-2/5 gap-4 items-center justify-center w-full">
        <div>
        <img src={logo} alt="Logo" className="h-8 sm:h-12" />
        </div>
        <div className="text-white text-center">
          <p className="font-semibold text-[24px] uppercase">
            RIDE IN
          </p>
          <p className="font-semibold text-[24px] uppercase">
            PROGRESS
          </p>
        </div>
      </div>

      <div className="border border-white/50 p-4 rounded-md w-full max-w-sm mx-auto">
        <div className="flex justify-between mb-4">
          <span className="text-white font-normal text-[16px]">Rider Name :</span>
          <span className="text-white">Abebe</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white font-normal text-[16px]">Number Plate :</span>
          <span className="text-white">AB12347</span>
        </div>
      </div>


      {/* Buttons and Footer */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center gap-3 flex-shrink-0">
        <PrimaryButton title="Confirm End Trip" />
        <Footer text="Powered by Moto street pickup" />
      </div>
    </MainContentWrapper>
  );
};

export default Entry;
