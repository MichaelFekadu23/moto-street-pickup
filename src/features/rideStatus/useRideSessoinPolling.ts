import { useEffect, useRef, useState } from 'react';
import { fetchRideSession, type RideStatus } from '../rides/status';

type Opts = {
  rideId: string;
  intervalMs?: number; // default 2000
};

export function useRideSessionPolling({ rideId, intervalMs = 2000 }: Opts) {
  const [status, setStatus] = useState<RideStatus>('in_progress');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const stopped = useRef(false);
  const consecutiveErr = useRef(0);

  useEffect(() => {
    if (!rideId) return;
    stopped.current = false;

    let timer: number | null = null;

    const tick = async () => {
      if (stopped.current) return;

      // save battery when tab is hidden
      if (document.hidden) {
        timer = window.setTimeout(tick, intervalMs);
        return;
      }

      try {
        setLoading(true);
        const resp = await fetchRideSession(rideId);
        setStatus(resp.data.status);
        setError(null);
        consecutiveErr.current = 0;

        // stop polling after terminal “trip completed”
        if (resp.data.status === 'trip_completed') {
          stopped.current = true;
          setLoading(false);
          return;
        }

        timer = window.setTimeout(tick, intervalMs);
      } catch (e: any) {
        // simple backoff
        consecutiveErr.current = Math.min(consecutiveErr.current + 1, 5);
        const next = intervalMs + consecutiveErr.current * 1000;
        setError(e?.message || 'Failed to fetch ride status');
        timer = window.setTimeout(tick, next);
      } finally {
        setLoading(false);
      }
    };

    timer = window.setTimeout(tick, 0);

    return () => {
      stopped.current = true;
      if (timer) clearTimeout(timer);
    };
  }, [rideId, intervalMs]);

  return { status, loading, error };
}
