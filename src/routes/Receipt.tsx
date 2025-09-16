import { useEffect, useMemo, useState } from 'react';
import MainContentWrapper from '../components/MianContentWrapper';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import pay from '../assets/pay.svg';
import { Link } from 'react-router-dom';
import { fetchRideFare, type FareResponse } from '../features/rides/fare';

function round(n: number, dp = 1) {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

const Receipt = () => {
  const rideId = useMemo(() => localStorage.getItem('moto_rideId') || '', []);
  const [fare, setFare] = useState<FareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!rideId) { setErr('Missing ride id'); setLoading(false); return; }
      try {
        setLoading(true);
        const data = await fetchRideFare(rideId);
        if (!alive) return;
        setFare(data);
        setErr(null);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || 'Failed to load fare');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [rideId]);

  const currency = fare?.breakdown?.currency && fare.breakdown.currency.trim() !== '' ? fare.breakdown.currency : 'ETB';
  const total = fare?.total_fare ?? fare?.breakdown?.total_fare;

  // save to localStorage for trip-complete page
  useEffect(() => {
    if (fare) {
      localStorage.setItem('moto_fare', JSON.stringify(fare));
    }
  }, [fare]);

  return (
    <MainContentWrapper>
      {/* Header */}
      <div className="flex flex-col gap-4 items-center justify-center w-full mt-8">
        <img src={logo} alt="Logo" className="w-[120px] h-[27.72px] md:w-[180px] md:h-[41.58px]" />
        <div className="text-white text-center">
          <p className="font-semibold text-[24px] uppercase">TRIP</p>
          <p className="font-semibold text-[24px] uppercase">COMPLETED</p>
        </div>
      </div>

      {/* Fare card */}
      <div className="border border-white/50 p-4 rounded-md w-full max-w-sm mx-auto">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-white/20 rounded w-3/4" />
            <div className="h-4 bg-white/20 rounded w-2/3" />
            <div className="h-4 bg-white/20 rounded w-1/2" />
          </div>
        ) : err ? (
          <div className="text-red-400 text-center text-sm">{err}</div>
        ) : (
          <>
            <div className="flex justify-between mb-3">
              <span className="text-white/90 font-normal text-[16px]">Distance :</span>
              <span className="text-white">{round(fare!.distance_km, 1)} km</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-white/90 font-normal text-[16px]">Time :</span>
              <span className="text-white">{Math.round(fare!.duration_minutes)} mins</span>
            </div>

            {/* <div className="h-px bg-white/20 my-2" /> */}

            {/* <div className="flex justify-between mb-1">
              <span className="text-white/70 text-sm">Base fare</span>
              <span className="text-white/80 text-sm">
                {currency} {fare!.breakdown.base_fare}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-white/70 text-sm">Distance fare</span>
              <span className="text-white/80 text-sm">
                {currency} {fare!.breakdown.distance_fare}
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-white/70 text-sm">Time fare</span>
              <span className="text-white/80 text-sm">
                {currency} {fare!.breakdown.time_fare}
              </span>
            </div> */}

            {/* <div className="h-px bg-white/20 my-2" /> */}

            <div className="flex justify-between">
              <span className="text-white/90 font-normal text-[16px]">Total :</span>
              <span className="text-white/90 font-normal">
                {currency} {total}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Pay CTA + footer */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center gap-3 flex-shrink-0">
        <Link to="/trip-complete" className="w-full">
          <button
            className="relative w-full bg-black py-3 px-4 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            disabled={loading || !!err}
            aria-disabled={loading || !!err}
          >
            <img src={pay} className="h-5 w-5" alt="Pay Icon" />
            <span className="text-center font-semibold text-[14px]">
              {loading ? 'Loading fare…' : 'Pay Now'}
            </span>
          </button>
        </Link>
        <Footer text="Powered by Moto street pickup" />
      </div>
    </MainContentWrapper>
  );
};

export default Receipt;
