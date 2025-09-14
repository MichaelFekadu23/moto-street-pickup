import { useEffect, useRef, useState } from 'react';
import { fetchRideSession } from '../rides/status';
import { useRideSocket } from './useRideSocket';
import type { RideStatus, RiderWsMessage } from './types';

type Opts = {
  rideId: string;
  onAccepted: () => void;   // navigate('/trip')
  onRejected?: () => void;  // optional, navigate back to entry
  pollMs?: number;          // fallback polling cadence (default 2000)
  usePollingFallback?: boolean; // default true
};

function extractStatus(msg: RiderWsMessage): string | undefined {
  // Look in top-level, then in data.status
  if (typeof msg.status === 'string') return msg.status;
  const ds = (msg?.data as any)?.status;
  return typeof ds === 'string' ? ds : undefined;
}

export function useAwaitingDriverAcceptHybrid({
  rideId,
  onAccepted,
  onRejected,
  pollMs = 2000,
  usePollingFallback = true,
}: Opts) {
  const [status, setStatus] = useState<RideStatus>('pending_driver_confirmation');
  const firedRef = useRef(false);

  // --- WebSocket path (preferred) ---
  const { connected, last } = useRideSocket({ rideId });

  useEffect(() => {
    if (!last || firedRef.current) return;
    if (last.ride_id && last.ride_id !== rideId) return;

    const s = (extractStatus(last) || '').toLowerCase();

    // Normalize status for UI
    if (s) {
      if (s === 'cancelled') setStatus('cancelled');
      if (s === 'completed') setStatus('trip_completed');
      if (s === 'pending_driver_confirmation') setStatus('pending_driver_confirmation');
      if (s === 'en_route') setStatus('en_route');
      if (s === 'in_progress') setStatus('in_progress');
    }

    // Accept when en_route or in_progress
    if (s === 'en_route' || s === 'in_progress') {
      firedRef.current = true;
      onAccepted();
    }
  }, [last, rideId, onAccepted]);

  // --- Polling fallback (kicks in when WS not connected or backend not pushing) ---
  useEffect(() => {
    if (!usePollingFallback) return;
    if (!rideId) return;

    let timer: number | null = null;
    let errCount = 0;

    const tick = async () => {
      if (firedRef.current) return;

      // Only poll when not connected OR when connected but we haven't heard anything yet
      const shouldPoll = !connected;
      if (!shouldPoll) {
        timer = window.setTimeout(tick, pollMs);
        return;
      }

      try {
        const resp = await fetchRideSession(rideId);
        setStatus(resp.data.status as RideStatus);

        if (resp.data.status === 'en_route' || resp.data.status === 'in_progress') {
          firedRef.current = true;
          onAccepted();
          return;
        }
        if (resp.data.status as RideStatus === 'rejected' || resp.data.status === 'trip_completed') {
          // stop on terminal states
          firedRef.current = true;
          onRejected?.();
          return;
        }

        errCount = 0;
        timer = window.setTimeout(tick, pollMs);
      } catch {
        errCount = Math.min(errCount + 1, 5);
        const next = pollMs + errCount * 1000;
        timer = window.setTimeout(tick, next);
      }
    };

    timer = window.setTimeout(tick, pollMs);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [rideId, onAccepted, pollMs, connected, usePollingFallback]);

  return { status, wsConnected: connected };
}
