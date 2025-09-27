// hooks/useFare.ts
import { useEffect, useState } from 'react';
import { rideApi, useApiError, type FareResponse } from '../services/apiService';

interface UseFareProps {
  rideId: string;
  persistToLocalStorage?: boolean;
}

export function useFare({ rideId, persistToLocalStorage = true }: UseFareProps) {
  const [fare, setFare] = useState<FareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleApiError } = useApiError();

  useEffect(() => {
    let isActive = true;

    const fetchFare = async () => {
      if (!rideId) {
        setError('Missing ride ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await rideApi.getRideFare(rideId);

        if (!isActive) return;

        if (response.success && response.data) {
          setFare(response.data);
          
          // Persist to localStorage if requested
          if (persistToLocalStorage) {
            localStorage.setItem('moto_fare', JSON.stringify(response.data));
          }
        } else {
          const errorMessage = handleApiError(response.error || null);
          setError(errorMessage);
        }
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : 'Failed to load fare');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchFare();

    return () => {
      isActive = false;
    };
  }, [rideId, persistToLocalStorage]); // Removed handleApiError from dependencies

  // Helper functions for fare calculations
  const currency = fare?.breakdown?.currency?.trim() || 'ETB';
  const totalFare = fare?.total_fare ?? fare?.breakdown?.total_fare ?? 0;

  const round = (n: number, dp = 1) => {
    const factor = Math.pow(10, dp);
    return Math.round(n * factor) / factor;
  };

  const refetch = async () => {
    if (!rideId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await rideApi.getRideFare(rideId);
      
      if (response.success && response.data) {
        setFare(response.data);
        
        if (persistToLocalStorage) {
          localStorage.setItem('moto_fare', JSON.stringify(response.data));
        }
      } else {
        const errorMessage = handleApiError(response.error || null);
        setError(errorMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fare');
    } finally {
      setLoading(false);
    }
  };

  return {
    fare,
    loading,
    error,
    currency,
    totalFare,
    distanceKm: fare ? round(fare.distance_km, 1) : 0,
    durationMinutes: fare ? Math.round(fare.duration_minutes) : 0,
    refetch,
  };
}