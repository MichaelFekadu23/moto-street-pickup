import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainContentWrapper from '../components/MianContentWrapper';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import pay from '../assets/pay.svg';
import { fetchRideFare, type FareResponse } from '../features/rides/fare';

function round(n: number, dp = 1) {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

type PaymentResponse = {
  message: string;
  method: string;
  paid: boolean;
  processed_at: string;
  ride_id: string;
};

const BASE = import.meta.env.VITE_API_BASE_URL; // must be HTTPS in production

async function processPayment(rideId: string, method: string): Promise<PaymentResponse> {
  const res = await fetch(`${BASE}/street-ride/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ ride_id: rideId, method }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Payment failed (${res.status}) ${msg}`);
  }
  return res.json();
}

const Receipt = () => {
  const navigate = useNavigate();

  // from your flow; adjust key names if different
  const rideId = useMemo(() => localStorage.getItem('moto_rideId') || '', []);
  const paymentMethod = useMemo(
    () => localStorage.getItem('moto_payment_method') || 'cash', // fallback to 'cash'
    []
  );

  const [fare, setFare] = useState<FareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // paying state
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);

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

  const onPay = async () => {
    if (!rideId) return;
    setPayErr(null);
    setPaying(true);
    try {
      const res = await processPayment(rideId, paymentMethod /* , authToken? */);
      if (!res.paid) throw new Error('Payment not marked as paid.');
      // persist for the next screen if needed
      localStorage.setItem('moto_payment', JSON.stringify(res));
      navigate('/trip-completed', { replace: true });
    } catch (e: any) {
      setPayErr(e?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

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
        <button
          onClick={onPay}
          className="relative w-full bg-black py-3 px-4 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          // disabled={loading || !!err || paying || !rideId}
          aria-disabled={loading || !!err || paying || !rideId}
          title={!rideId ? 'Missing ride id' : undefined}
        >
          <img src={pay} className="h-5 w-5" alt="Pay Icon" />
          <span className="text-center font-semibold text-[14px]">
            {loading ? 'Loading fare…' : paying ? 'Processing…' : `Pay Now`}
          </span>
        </button>

        {payErr && <div className="text-red-600 text-center text-sm">{payErr}</div>}

        <Footer text="Powered by Moto street pickup" />
      </div>
    </MainContentWrapper>
  );
};

export default Receipt;
