// hooks/useRideConfirmation.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideApi, useApiError } from '../services/apiService';

interface UseRideConfirmationProps {
  rideId: string;
  onSuccess?: () => void;
  successRoute?: string;
}

export function useRideConfirmation({ 
  rideId, 
  onSuccess, 
  successRoute = '/receipt' 
}: UseRideConfirmationProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { handleApiError } = useApiError();

  const confirmRideEnd = async () => {
    if (confirming || !rideId){
      setError('No ride to confirm or already confirming.');
      return;
    }
    
    setConfirming(true);
    setError(null);

    const response = await rideApi.confirmRideEnd(rideId);
    
    setConfirming(false);

    if (response.success) {
      onSuccess?.();
      navigate(successRoute);
    } else {
      const errorMessage = handleApiError(response.error || null);
      setError(errorMessage);
    }
  };

  const clearError = () => setError(null);

  return {
    confirmRideEnd,
    confirming,
    error,
    clearError,
  };
}