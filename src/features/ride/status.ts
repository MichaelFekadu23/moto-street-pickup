import { requestJSON } from '../../lib/api';

export type RideStatus =
  | 'pending_driver_confirmation'
  | 'en_route'
  | 'in_progress'
  | 'trip_completed'      // <-- add this
  | 'completed'
  | 'rejected'            // (keep if backend also uses this)
  | 'cancelled';

export type RideSessionResp = {
  data: { status: RideStatus };
  ride_id: string;
  // status: RideStatus;
};

export async function fetchRideSession(rideId: string) {
  // If VITE_API_BASE_URL already ends with /v1, do NOT prefix /v1 here.
  return requestJSON<RideSessionResp>(`/ride-session/${encodeURIComponent(rideId)}`, {
    method: 'GET',
  });
}
