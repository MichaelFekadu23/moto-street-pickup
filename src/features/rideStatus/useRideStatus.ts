import { useEffect, useMemo, useState } from "react";
import { useRiderSocket } from "./useRiderSocket";
import { extractStatusAndRideId } from "./parse";
import { buildRideSessionUrl } from "./url";
import type { RideStatus } from "./types";

export function useRideStatus(opts: {
  rideId: string;
  phoneNumber: string;
  pollMs?: number;
  usePollingFallback?: boolean;
  disableWebSocket?: boolean;
}) {
  const {
    rideId,
    phoneNumber,
    pollMs = 3000,
    usePollingFallback = true,
    disableWebSocket = false,
  } = opts;

  const [status, setStatus] = useState<RideStatus>("pending_driver_confirmation");
  const [pollError, setPollError] = useState<string | null>(null);

  const ws = useRiderSocket(phoneNumber, { disabled: disableWebSocket, maxReconnects: 3 });
  const wsInfo = useMemo(() => extractStatusAndRideId(ws.lastMessage), [ws.lastMessage]);

  // Apply WS updates only if message matches this ride
  useEffect(() => {
    if (!wsInfo.status) return;

    const msgRideId = (wsInfo.rideId ?? "").trim();
    const isSameRide =
      !msgRideId || !rideId ? true : msgRideId === rideId;

    if (isSameRide) {
      setStatus(wsInfo.status);
    }
  }, [wsInfo, rideId]);

  // Polling fallback: only when WS not connected OR explicitly disabled
  useEffect(() => {
    if (!usePollingFallback) return;
    if (!rideId) return;

    let timer: number | null = null;
    let cancelled = false;

    const poll = async () => {
      const shouldPoll = disableWebSocket || !ws.connected;
      if (!shouldPoll) {
        timer = window.setTimeout(poll, pollMs);
        return;
      }

      try {
        const url = buildRideSessionUrl(rideId);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        const s = (body?.data?.status ?? body?.status) as RideStatus | undefined;
        if (s) setStatus(s);
        setPollError(null);
      } catch (err: any) {
        setPollError(err?.message || "Polling failed");
      } finally {
        if (!cancelled) timer = window.setTimeout(poll, pollMs);
      }
    };

    timer = window.setTimeout(poll, pollMs);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [rideId, pollMs, ws.connected, usePollingFallback, disableWebSocket]);

  return {
    status,
    wsConnected: ws.connected,
    wsError: ws.error,
    pollError,
    lastMessage: ws.lastMessage,
  };
}
