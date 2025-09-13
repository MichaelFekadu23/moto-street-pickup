import MainContentWrapper from '../components/MianContentWrapper';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import pay from '../assets/pay.svg';
import { Link } from 'react-router-dom';

const Entry = () => {
  
  return (
    <MainContentWrapper>
      {/* Logo and Driver Info should take higher space */}
      <div className="flex flex-col gap-4 items-center justify-center w-full mt-8">
        <div>
        <img src={logo} alt="Logo" className="w-[120px] h-[27.72px]" />
        </div>
        <div className="text-white text-center">
          <p className="font-semibold text-[24px] uppercase">
            TRIPE
          </p>
          <p className="font-semibold text-[24px] uppercase">
            COMPLETE
          </p>
        </div>
      </div>

      <div className="border border-white/50 p-4 rounded-md w-full max-w-sm mx-auto">
        <div className="flex justify-between mb-4">
          <span className="text-white font-normal text-[16px]">Distance :</span>
          <span className="text-white">4.5 km</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-white font-normal text-[16px]">Time :</span>
          <span className="text-white">12 mins</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white font-normal text-[16px]">Total :</span>
          <span className="text-white">ETB 150</span>
        </div>
      </div>


      {/* Buttons and Footer */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center gap-3 flex-shrink-0">
        <Link to={"/trip-complete"} className="w-full">
          <button className="relative w-full bg-black py-3 px-4 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
            <img src={pay} className='h-5 w-5' alt="Pay Icon"/>
            <span className="text-center font-semibold text-[14px]">Pay Now</span>
          </button>
        </Link>
        <Footer text="Powered by Moto street pickup" />
      </div>
    </MainContentWrapper>
  );
};

export default Entry;
