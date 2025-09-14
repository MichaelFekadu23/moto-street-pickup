import { requestJSON } from '../../lib/api';

export type FareBreakdown = {
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  total_fare: number;
  currency: string;        // e.g., "ETB"
  distance?: number;       // optional if backend includes meters/km here too
  duration?: number;       // optional seconds
};

export type FareResponse = {
  total_fare: number;
  breakdown: FareBreakdown;
  distance_km: number;     // e.g., 5.2
  duration_minutes: number;// e.g., 25
};

// If VITE_API_BASE_URL already ends with /v1, do NOT prefix /v1 here.
export async function fetchRideFare(rideId: string) {
  return requestJSON<FareResponse>(`/street-ride/fare/${encodeURIComponent(rideId)}`, {
    method: 'GET',
  });
}
