// Rider-facing status + WS message types

export type RideStatus =
  | 'pending_driver_confirmation'
  | 'en_route'
  | 'rejected'
  | 'in_progress'
  | 'trip_completed'
  | 'cancelled';

export type RideSessionResp = {
  data: { status: RideStatus };
  ride_id: string;
};

export type RiderWsEventType =
  | 'status_update'
  | 'ride_cancelled'
  | 'ride_completed'
  | 'ride_started'
  | 'ride_initiated';

export type RiderWsMessage = {
  type: RiderWsEventType;
  ride_id?: string;
  status?: string;   // some servers put it here
  time?: string;
  message?: string;
  data?: { status?: string; [k: string]: unknown } | unknown;
};
