export type RideStatus =
  | "pending_driver_confirmation"
  | "en_route"
  | "rejected"
  | "in_progress"
  | "trip_completed"
  | "cancelled";

// Raw event shape coming from your WS "push" channel
export interface RawPushMessage {
  type: string;               // e.g., "ride_accepted", "trip_started", "ride_cancelled", "trip_completed"
  channel?: string;           // "push"
  title?: string;
  message?: string;
  time?: string;
  priority?: string;
  recipient_id?: string;      // "2519..."
  recipient_type?: string;    // "rider"
  metadata?: Record<string, any>; // contains ride_id and other info
  [k: string]: any;
}

export interface WsState {
  connected: boolean;
  lastMessage: RawPushMessage | null;
  error: string | null;
}
