// hooks/usePayment.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideApi, useApiError, type PaymentResponse } from '../services/apiService';

interface UsePaymentProps {
  rideId: string;
  paymentMethod?: string;
  successRoute?: string;
  persistToLocalStorage?: boolean;
  onSuccess?: (response: PaymentResponse) => void;
}

export function usePayment({
  rideId,
  paymentMethod = 'cash',
  successRoute = '/trip-completed',
  persistToLocalStorage = true,
  onSuccess,
}: UsePaymentProps) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { handleApiError } = useApiError();

  const processPayment = async (method?: string) => {
    if (!rideId || paying) return;

    const payMethod = method || paymentMethod;
    
    setPaying(true);
    setError(null);

    try {
      const response = await rideApi.processPayment(rideId, payMethod);

      if (response.success && response.data) {
        if (!response.data.paid) {
          throw new Error('Payment not marked as paid');
        }

        // Persist to localStorage if requested
        if (persistToLocalStorage) {
          localStorage.setItem('moto_payment', JSON.stringify(response.data));
        }

        // Call success callback
        onSuccess?.(response.data);

        // Navigate to success route
        navigate(successRoute, { replace: true });
      } else {
        const errorMessage = handleApiError(response.error || null);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
    } finally {
      setPaying(false);
    }
  };

  const clearError = () => setError(null);

  return {
    processPayment,
    paying,
    error,
    clearError,
  };
}