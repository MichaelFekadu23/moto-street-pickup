import MainContentWrapper from '../components/MianContentWrapper';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import Completed from '../assets/completed.png';
import Share from '../assets/share.svg';

const AwaitingDriverConfirm = () => {
  return (
    <MainContentWrapper>        
      {/* Logo + Driver Info */}
      <div className="flex basis-2/5 items-center justify-center w-full">
        <div className={`flex flex-col items-center justify-center`}>
          <img src={logo} alt="Logo" className="h-10 sm:h-12" />
          <div className="text-white text-center mt-5">
            <p className="text-lg sm:text-xl">Your Trip: 4.5km | 12mins</p>
            <p className="text-[#01C705] font-semibold">ETB 150</p>
            <p className="text-lg sm:text-xl">Paid Via Card</p>
          </div>
        </div>
      </div>

      {/* Profile + Awaiting Message */}
      <div className="flex flex-col items-center justify-start flex-grow">
        <img src={Completed} alt="Profile" className="h-20 w-20 m-4" />
          <p className="font-semibold text-[20px] uppercase text-white">
            THANK YOU
          </p>
      </div>
      <div className="flex flex-col gap-4">
        <button className="relative bg-transparent border-1 border-black text-black py-3 px-4 rounded-md flex items-center justify-center gap-3">
          <img src={Share} className='h-5 w-5' alt="Share Icon"/>
          <span className="text-center font-semibold text-[14px]">Share Receipt</span>
        </button>

        {/* Footer stays at bottom */}
        <div className="mt-auto">
          <Footer text="Powered by Moto street pickup" />
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default AwaitingDriverConfirm;
