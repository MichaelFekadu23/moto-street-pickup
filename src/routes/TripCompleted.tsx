import { useMemo } from 'react';
import MainContentWrapper from '../components/MianContentWrapper';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import Completed from '../assets/completed.png';
import Share from '../assets/share.svg';
import { useShareReceipt } from '../features/receipt/useShareReceipt';
import type { FareResponse } from '../features/rides/fare';
import { LoadingDots } from '../components/LoadingDots';

const TripCompleted = () => {
  // get ride fare from localStorage
  const fare = localStorage.getItem('moto_fare');
  let fareObj: FareResponse | null = null;
  if (fare) {
    try {
      fareObj = JSON.parse(fare);
    } catch {
      fareObj = null;
    }
  }

  // Resolve rideId from your stored fare or a fallback LS key
  const rideId = useMemo(() => {
    // Adjust these paths to match your actual FareResponse shape
    return (
      (fareObj as any)?.ride_id ||
      (fareObj as any)?.rideId ||
      localStorage.getItem('moto_rideId') ||
      ''
    );
  }, [fareObj]);

  const { share, loading } = useShareReceipt(/* authToken? */);

  const onShare = async () => {
    if (!rideId) {
      console.warn('No rideId found; cannot fetch receipt.');
      return;
    }
    const res = await share(rideId);
    if (res.ok) {
      console.log(`Receipt shared via ${res.method}`);
      // TODO: toast.success(`Receipt shared via ${res.method}`);
    } else {
      console.error(res.error);
      // TODO: toast.error(res.error);
    }
  };

  const canShare = Boolean(rideId) && !loading;

  return (
    <MainContentWrapper>
      <div className="flex flex-col gap-8 w-full max-w-sm">
        {/* Logo + Driver Info */}
        <div className="flex items-center justify-center w-full mt-10">
          <div className="flex flex-col items-center justify-center">
            <img src={logo} alt="Logo" className="w-[120px] h-[27.72px] md:w-[180px] md:h-[41.58px]" />
            <div className="text-white text-center mt-5 flex flex-col gap-1">
              <p className="text-lg sm:text-xl">
                Your Trip: {fareObj?.distance_km} Km | {fareObj?.duration_minutes} Mins
              </p>
              <p className="text-[#01C705] font-semibold">ETB {fareObj?.breakdown?.total_fare}</p>
              <p className="text-lg sm:text-xl">Paid Via Cash</p>
            </div>
          </div>
        </div>

        {/* Profile + Message */}
        <div className="flex flex-col items-center justify-start">
          <img src={Completed} alt="Profile" className="h-20 w-20 mb-4" />
          <p className="font-semibold text-[20px] uppercase text-white">THANK YOU</p>
        </div>

        {/* Share Receipt */}
        <div className="flex flex-col gap-4 w-full">
          <button disabled={!canShare} onClick={onShare} className="relative bg-transparent border-1 border-black text-black py-3 px-4 rounded-md flex items-center justify-center gap-3">
            {canShare ? (
              <>
                <img src={Share} className='h-5 w-5' alt="Share Icon"/>
                <span className="text-center font-semibold text-[14px]">Share Receipt</span>
              </>
            ) : loading ? (
              <LoadingDots />
            ) : (
              <span className='text-center font-semibold text-[14px]'>No Receipt Available</span>
            )}
          </button>

          {/* Footer stays at bottom */}
          <div className="mt-auto">
            <Footer text="Powered by Moto street pickup" />
          </div>
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default TripCompleted;
