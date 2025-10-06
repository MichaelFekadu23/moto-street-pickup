// pages/Receipt.tsx
import { useMemo } from 'react';
import MainContentWrapper from '../components/MianContentWrapper';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import pay from '../assets/pay.svg';
import { LoadingDots } from '../components/LoadingDots';
import { useFare } from '../hooks/useFare';
import { usePayment } from '../hooks/usePayment';
import { t } from 'i18next';
import { useRide } from '../features/ride/rideContext';

const Receipt = () => {
  // Get ride details from localStorage
  const rideId = useMemo(() => localStorage.getItem('moto_rideId') || '', []);
  const paymentMethod = useMemo(
    () => localStorage.getItem('moto_payment_method') || 'cash',
    []
  );
  const { language } = useRide();
  const currentLanguage = language || localStorage.getItem('moto_language') || 'en';

  // Fetch fare data
  const {
    fare,
    loading: fareLoading,
    error: fareError,
    currency,
    totalFare,
    distanceKm,
    durationMinutes,
    refetch,
  } = useFare({
    rideId,
    persistToLocalStorage: true,
  });

  // Handle payment
  const {
    processPayment,
    paying,
    error: paymentError,
  } = usePayment({
    rideId,
    paymentMethod,
    successRoute: '/trip-completed',
    persistToLocalStorage: true,
  });

  const handlePayment = () => {
    if (!rideId || fareLoading || fareError || paying) return;
    processPayment();
  };

  const handleRetryFare = () => {
    refetch();
  };

  const isPaymentDisabled = fareLoading || !!fareError || paying || !rideId;

  return (
    <MainContentWrapper>
      {/* Header */}
      <div className="flex flex-col gap-4 items-center justify-center w-full mt-8">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-[120px] h-[27.72px] md:w-[180px] md:h-[41.58px]" 
        />
        <div className="text-white text-center">
          <p className="font-semibold text-[24px] uppercase">{t("TRIP")}</p>
          <p className="font-semibold text-[24px] uppercase">{t("COMPLETED")}</p>
        </div>
      </div>

      {/* Fare card */}
      <div className="border border-white/50 p-4 rounded-md w-full max-w-sm mx-auto">
        {fareLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-white/20 rounded w-3/4" />
            <div className="h-4 bg-white/20 rounded w-2/3" />
            <div className="h-4 bg-white/20 rounded w-1/2" />
          </div>
        ) : fareError ? (
          <div className="text-center space-y-3">
            <div className="text-red-400 text-sm">{fareError}</div>
            <button
              onClick={handleRetryFare}
              className="text-white/70 hover:text-white text-sm underline"
            >
              Retry loading fare
            </button>
          </div>
        ) : fare ? (
          <>
            <div className="flex justify-between mb-3">
              <span className="text-white/90 font-normal text-[16px]">{t("Distance")} :</span>
              <span className="text-white">{distanceKm} {t("km")}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-white/90 font-normal text-[16px]">{t("Time")} :</span>
              <span className="text-white">{durationMinutes} {t("mins")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/90 font-normal text-[16px]">{t("Total")} :</span>
              <span className="text-white/90 font-normal">
                {currentLanguage === 'am' ? `${totalFare} ${t(currency)}` : `${t(currency)} ${totalFare}`}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {/* Pay CTA + footer */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center gap-3 flex-shrink-0">
        <button
          onClick={handlePayment}
          className="relative w-full bg-black py-3 px-4 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:bg-gray-800"
          disabled={isPaymentDisabled}
          aria-disabled={isPaymentDisabled}
          title={!rideId ? 'Missing ride ID' : fareError ? 'Cannot process payment due to fare loading error' : undefined}
        >
          {paying ? (
            <LoadingDots />
          ) : (
            <>
              <img src={pay} className="h-5 w-5" alt="Pay Icon" />
              <span className="text-center font-semibold text-[14px]">
                {fareLoading ? t("Loading Fare...") : t("Pay Now")}
              </span>
            </>
          )}
        </button>

        {paymentError && (
          <div className="text-red-600 text-center text-sm">{paymentError}</div>
        )}

        <Footer text="Powered by Moto street pickup" />
      </div>
    </MainContentWrapper>
  );
};

export default Receipt;