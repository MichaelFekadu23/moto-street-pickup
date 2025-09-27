export type StreetRideInitiateReq = {
  driver_id: string;
  phone: string;
  rider_name: string;
};

export type StreetRideStatus =
  | 'pending_driver_confirmation'
  | 'in_progress'
  | 'rejected'
  | 'completed'
  | 'trip_completed'
  | 'cancelled';

export type StreetRideInitiateResp = {
  ride_id: string;
  status: StreetRideStatus;
};

// Optional normalized type if you prefer camelCase in app code
export type Ride = {
  rideId: string;
  status: StreetRideStatus;
};
