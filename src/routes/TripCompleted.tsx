import { useMemo } from 'react';
import MainContentWrapper from '../components/MianContentWrapper';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import Completed from '../assets/completed.png';
import Share from '../assets/share.svg';
import { LoadingDots } from '../components/LoadingDots';
import { useFareData } from '../hooks/useFareData';
import { useReceipt } from '../hooks/useReceipt';
import { useReceiptShare } from '../hooks/useReceiptShare';
import { useRide } from '../features/ride/rideContext';
import { t } from 'i18next';

// Helper function to convert share method to user-friendly text
const getShareMethodText = (method: string): string => {
  switch (method) {
    case 'file':
      return 'file';
    case 'text':
      return 'sharing';
    case 'clipboard':
      return 'clipboard (copied!)';
    default:
      return method;
  }
};

const TripCompleted = () => {
  // Get rideId from localStorage
  const { ride } = useRide();
  const rideId = useMemo(() => {
    return localStorage.getItem('moto_rideId') || ride?.rideId || '';
  }, [ride]);
  const { language } = useRide();
  const currentLanguage = language || localStorage.getItem('moto_language') || 'en';

  // Get fallback data from localStorage (for immediate display)
  const fallbackData = useFareData();

  // Fetch receipt from API (this will update with fresh data)
  const {
    receipt,
    loading: receiptLoading,
    error: receiptError,
    distanceKm: receiptDistance,
    durationMinutes: receiptDuration,
    totalFare: receiptFare,
    currency: receiptCurrency,
    paymentMethod: receiptPayment,
  } = useReceipt({
    rideId: rideId || fallbackData.rideId,
    autoFetch: Boolean(rideId || fallbackData.rideId), // Only fetch if we have a rideId
  });

  // Determine what data to display
  const displayData = useMemo(() => {
    // If we have receipt data from API, use it
    if (receipt) {
      return {
        distanceKm: receiptDistance,
        durationMinutes: receiptDuration,
        totalFare: receiptFare,
        currency: receiptCurrency,
        paymentMethod: receiptPayment,
        source: 'api',
        hasData: true,
      };
    }
    
    // If receipt is still loading but we have fallback data, show it
    if (receiptLoading && fallbackData.fareObj) {
      return {
        distanceKm: fallbackData.distanceKm,
        durationMinutes: fallbackData.durationMinutes,
        totalFare: fallbackData.totalFare,
        currency: fallbackData.currency,
        paymentMethod: fallbackData.paymentMethod,
        source: 'cache',
        hasData: true,
      };
    }
    
    // If receipt failed to load but we have fallback data, use it
    if (receiptError && fallbackData.fareObj) {
      return {
        distanceKm: fallbackData.distanceKm,
        durationMinutes: fallbackData.durationMinutes,
        totalFare: fallbackData.totalFare,
        currency: fallbackData.currency,
        paymentMethod: fallbackData.paymentMethod,
        source: 'cache',
        hasData: true,
      };
    }
    
    // No data available
    return {
      distanceKm: 0,
      durationMinutes: 0,
      totalFare: 0,
      currency: 'ETB',
      paymentMethod: 'Cash',
      source: 'none',
      hasData: false,
    };
  }, [
    receipt, 
    receiptLoading, 
    receiptError, 
    receiptDistance, 
    receiptDuration, 
    receiptFare, 
    receiptCurrency, 
    receiptPayment,
    fallbackData
  ]);

  const finalRideId = rideId || fallbackData.rideId;

  // Handle receipt sharing with improved feedback
  const { shareReceipt, loading: shareLoading, error: shareError } = useReceiptShare({
    onSuccess: (method) => {
      const methodText = getShareMethodText(method);
      console.log(`Receipt shared via ${methodText}`);
      // TODO: Add toast notification
      // toast.success(`Receipt shared via ${methodText}!`);
    },
    onError: (error) => {
      console.error('Share receipt error:', error);
      // TODO: Add toast notification  
      // toast.error('Failed to share receipt. Please try again.');
    },
  });

  const handleShare = async () => {
    await shareReceipt(finalRideId);
  };

  // Can share if we have a rideId and we're not currently sharing
  const canShare = Boolean(finalRideId) && !shareLoading;
  
  // Only show loading skeleton if we're loading and have no fallback data
  const showLoadingState = receiptLoading && !fallbackData.fareObj;

  return (
    <MainContentWrapper>
      <div className="flex flex-col gap-8 w-full max-w-sm">
        {/* Logo + Trip Summary */}
        <div className="flex items-center justify-center w-full mt-10">
          <div className="flex flex-col items-center justify-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-[120px] h-[27.72px] md:w-[180px] md:h-[41.58px]" 
            />
            <div className="text-white text-center mt-5 flex flex-col gap-1">
              {showLoadingState ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-5 bg-white/20 rounded w-48 mx-auto" />
                  <div className="h-6 bg-white/20 rounded w-24 mx-auto" />
                  <div className="h-5 bg-white/20 rounded w-32 mx-auto" />
                </div>
              ) : displayData.hasData ? (
                <>
                  <p className="text-lg sm:text-xl">
                    {t("Your Trip")}: {displayData.distanceKm} {t("km")} | {displayData.durationMinutes} {t("mins")}
                  </p>
                  <p className="text-[#01C705] font-semibold">
                    {currentLanguage === 'am' 
                      ? `${displayData.totalFare} ${t(displayData.currency)}` 
                      : `${t(displayData.currency)} ${displayData.totalFare}`}
                  </p>
                  <p className="text-lg sm:text-xl">
                    {currentLanguage === 'am' 
                      ? `${t(displayData.paymentMethod)} ${t("Paid Via")}` 
                      : `${t("Paid Via")} ${t(displayData.paymentMethod)}`
                    }
                  </p>
                  {/* Show data source in development */}
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-white/40 mt-1">
                      Data from: {displayData.source}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-lg sm:text-xl text-white/60">
                    {t("Trip completed successfully")}
                  </p>
                  {receiptError && (
                    <p className="text-sm text-red-400 mt-2">
                      {t("Unable to load trip details")}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Completion Message */}
        <div className="flex flex-col items-center justify-start">
          <img 
            src={Completed} 
            alt="Trip Completed" 
            className="h-20 w-20 mb-4" 
          />
          <p className="font-semibold text-[20px] uppercase text-white">
            {t("THANK YOU")}
          </p>
        </div>

        {/* Share Receipt */}
        <div className="flex flex-col gap-4 w-full">
          <button 
            disabled={!canShare} 
            onClick={handleShare} 
            className="relative bg-transparent border border-gray-700 text-white py-3 px-4 rounded-md flex items-center justify-center gap-3 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            aria-label={canShare ? 'Share receipt' : 'Receipt not available'}
          >
            {shareLoading ? (
              <LoadingDots />
            ) : canShare ? (
              <>
                <img 
                  src={Share} 
                  className="h-5 w-5" 
                  alt="Share Icon"
                />
                <span className="text-center text-black font-semibold text-[14px]">
                  {t("Share Receipt")}
                </span>
              </>
            ) : (
              <span className="text-center text-black font-semibold text-[14px]">
                {t("No Receipt Available")}
              </span>
            )}
          </button>

          {/* Show share error if any */}
          {shareError && (
            <div className="text-red-600 text-center text-sm">
              {shareError}
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto">
            <Footer text="Powered by Moto street pickup" />
          </div>
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default TripCompleted;