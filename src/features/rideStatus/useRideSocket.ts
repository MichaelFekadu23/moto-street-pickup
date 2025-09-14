import { useEffect, useRef, useState } from 'react';
import { buildRideWsUrl } from '../ws/url';
import type { RiderWsMessage } from './types';

type Opts = {
  rideId?: string;
  // Heartbeat + reconnect settings
  pingMs?: number;        // client ping every N ms (default 30000)
  pongTimeoutMs?: number; // fail if no pong within this (default 10000)
};

export function useRideSocket({ rideId, pingMs = 30000, pongTimeoutMs = 10000 }: Opts) {
  const [connected, setConnected] = useState(false);
  const [last, setLast] = useState<RiderWsMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const pingTimer = useRef<number | null>(null);
  const pongTimer = useRef<number | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (!rideId) return;

    const url = buildRideWsUrl(rideId);

    const connect = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError(null);
        attempts.current = 0;

        // Start heartbeat
        if (pingTimer.current) clearInterval(pingTimer.current);
        pingTimer.current = window.setInterval(() => {
          try {
            ws.send(JSON.stringify({ type: 'ping' }));
            if (pongTimer.current) clearTimeout(pongTimer.current);
            pongTimer.current = window.setTimeout(() => {
              try { ws.close(); } catch {}
            }, pongTimeoutMs);
          } catch {/* ignore */}
        }, pingMs);
      };

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg?.type === 'pong') {
            if (pongTimer.current) clearTimeout(pongTimer.current);
            return;
          }
          setLast(msg as RiderWsMessage);
        } catch {/* ignore malformed */}
      };

      ws.onerror = () => setError('WebSocket error');

      ws.onclose = () => {
        setConnected(false);
        if (pingTimer.current) { clearInterval(pingTimer.current); pingTimer.current = null; }
        if (pongTimer.current) { clearTimeout(pongTimer.current); pongTimer.current = null; }
        const delay = Math.min(30000, 1000 * Math.pow(2, attempts.current++)); // 1s→30s backoff
        reconnectTimer.current = window.setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (pingTimer.current) clearInterval(pingTimer.current);
      if (pongTimer.current) clearTimeout(pongTimer.current);
      try { wsRef.current?.close(); } catch {}
      wsRef.current = null;
    };
  }, [rideId, pingMs, pongTimeoutMs]);

  return { connected, last, error };
}
