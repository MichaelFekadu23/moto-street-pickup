import { useEffect, useState } from 'react';
import { rideApi, useApiError } from '../services/apiService';
import type { Receipt } from '../utils/type';

interface UseReceiptProps {
  rideId: string;
  autoFetch?: boolean;
}

export function useReceipt({ rideId, autoFetch = true }: UseReceiptProps) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleApiError } = useApiError();

  const fetchReceipt = async (id?: string) => {
    const targetRideId = id || rideId;
    
    if (!targetRideId) {
      setError('Missing ride ID');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await rideApi.getReceipt(targetRideId);

      if (response.success && response.data) {
        setReceipt(response.data);
        return response.data;
      } else {
        const errorMessage = handleApiError(response.error || null);
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch receipt';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && rideId) {
      fetchReceipt();
    }
  }, [rideId, autoFetch]); // Removed handleApiError from dependencies

  const clearError = () => setError(null);
  const refetch = () => fetchReceipt();

  // Helper functions for formatting
  const round = (n: number, dp = 1) => {
    const factor = Math.pow(10, dp);
    return Math.round(n * factor) / factor;
  };

  return {
    receipt,
    loading,
    error,
    fetchReceipt,
    refetch,
    clearError,
    // Computed values from receipt
    distanceKm: receipt ? round(receipt.distance, 1) : 0,
    durationMinutes: receipt ? Math.round(receipt.duration) : 0,
    totalFare: receipt?.fare ?? 0,
    currency: receipt?.currency || 'ETB',
    paymentMethod: receipt?.payment_method 
      ? receipt.payment_method.charAt(0).toUpperCase() + receipt.payment_method.slice(1).toLowerCase()
      : 'Cash',
    driverName: receipt?.driver_name || '',
    plateNumber: receipt?.plate_number || '',
    vehicleModel: receipt?.vehicle_model || '',
    riderName: receipt?.rider_name || '',
  };
}