import { useMemo } from 'react';
import type { FareResponse } from '../services/apiService';

interface UseFareDataReturn {
  fareObj: FareResponse | null;
  rideId: string;
  distanceKm: number;
  durationMinutes: number;
  totalFare: number;
  currency: string;
  paymentMethod: string;
}

export function useFareData(): UseFareDataReturn {
  const fareObj = useMemo(() => {
    const fare = localStorage.getItem('moto_fare');
    if (!fare) return null;
    
    try {
      return JSON.parse(fare) as FareResponse;
    } catch {
      return null;
    }
  }, []);

  const rideId = useMemo(() => {
    if (!fareObj) {
      return localStorage.getItem('moto_rideId') || '';
    }
    
    // Try different possible fields for rideId
    return (
      (fareObj as any)?.ride_id ||
      (fareObj as any)?.rideId ||
      localStorage.getItem('moto_rideId') ||
      ''
    );
  }, [fareObj]);

  const paymentMethod = useMemo(() => {
    const payment = localStorage.getItem('moto_payment');
    if (payment) {
      try {
        const paymentObj = JSON.parse(payment);
        return paymentObj.method || 'Cash';
      } catch {
        // fallback
      }
    }
    return localStorage.getItem('moto_payment_method') || 'Cash';
  }, []);

  // Helper function to round numbers
  const round = (n: number, dp = 1) => {
    const factor = Math.pow(10, dp);
    return Math.round(n * factor) / factor;
  };

  return {
    fareObj,
    rideId,
    distanceKm: fareObj ? round(fareObj.distance_km, 1) : 0,
    durationMinutes: fareObj ? Math.round(fareObj.duration_minutes) : 0,
    totalFare: fareObj?.total_fare ?? fareObj?.breakdown?.total_fare ?? 0,
    currency: fareObj?.breakdown?.currency?.trim() || 'ETB',
    paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1).toLowerCase(),
  };
}