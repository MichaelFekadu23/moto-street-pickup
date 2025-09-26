import type { RawPushMessage, RideStatus } from "./types";

export function extractStatusAndRideId(msg: RawPushMessage | null): {
  status: RideStatus | null;
  rideId?: string | null;
} {
  if (!msg) return { status: null, rideId: null };

  const t = (msg.type || "").toLowerCase();
  const rideId = msg.metadata?.ride_id ?? msg.ride_id ?? null;

  switch (t) {
    case "ride_accepted":
      return { status: "en_route", rideId };
    case "trip_started":
      return { status: "in_progress", rideId };
    case "trip_ended":            // NEW: your “Trip Ended” push
      return { status: "trip_completed", rideId };
    case "trip_completed":
      return { status: "trip_completed", rideId };
    case "ride_cancelled":
      return { status: "cancelled", rideId };
    case "ride_rejected":         // your “Driver has declined…” push
      return { status: "rejected", rideId };
    default:
      return { status: null, rideId };
  }
}
