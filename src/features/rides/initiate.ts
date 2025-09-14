import { requestJSON } from '../../lib/api';
import type { StreetRideInitiateReq, StreetRideInitiateResp, Ride } from './types';

const PATH = '/street-ride/initiate';

export async function initiateStreetRide(body: StreetRideInitiateReq): Promise<Ride> {
  const res = await requestJSON<StreetRideInitiateResp>(PATH, { method: 'POST', body });
  return { rideId: res.ride_id, status: res.status };
}
