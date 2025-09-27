import { useState } from 'react';
import { rideApi, useApiError } from '../services/apiService';
import { shareReceipt as shareReceiptUtil } from '../utils/receiptShare';

interface UseReceiptShareProps {
  onSuccess?: (method: string) => void;
  onError?: (error: string) => void;
}

interface ShareResult {
  ok: boolean;
  method?: string;
  error?: string;
}

export function useReceiptShare({ 
  onSuccess, 
  onError 
}: UseReceiptShareProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleApiError } = useApiError();

  const shareReceipt = async (rideId: string): Promise<ShareResult> => {
    if (!rideId) {
      const errorMsg = 'No ride ID found; cannot fetch receipt.';
      setError(errorMsg);
      onError?.(errorMsg);
      return { ok: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      // First, fetch the receipt data
      const response = await rideApi.getReceipt(rideId);

      if (!response.success || !response.data) {
        const errorMsg = handleApiError(response.error || null);
        setError(errorMsg);
        if (errorMsg) {
          onError?.(errorMsg);
          return { ok: false, error: errorMsg };
        }
        return { ok: false, error: 'Failed to fetch receipt data.' };
      }

      // Then use the utility function to share it
      const shareResult = await shareReceiptUtil(response.data);
      const method = shareResult.method;
      
      onSuccess?.(method);
      return { ok: true, method };

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to share receipt';
      setError(errorMsg);
      onError?.(errorMsg);
      return { ok: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    shareReceipt,
    loading,
    error,
    clearError,
  };
}