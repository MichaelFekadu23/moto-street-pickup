import { useCallback, useEffect, useRef, useState } from "react";
import { buildRiderWsUrl } from "./url";
import type { RawPushMessage, WsState } from "./types";

export function useRiderSocket(
  phoneNumber: string,
  opts?: { maxReconnects?: number; disabled?: boolean }
) {
  const { maxReconnects = 3, disabled = false } = opts || {};

  const [state, setState] = useState<WsState>({
    connected: false,
    lastMessage: null,
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const mountedRef = useRef(false);
  const startedRef = useRef(false);

  const connect = useCallback(() => {
    if (!mountedRef.current || disabled) return;
    const phone = (phoneNumber ?? "").trim();
    if (!phone) return;

    if (wsRef.current && wsRef.current.readyState <= WebSocket.OPEN) return;

    if (attemptsRef.current >= maxReconnects) {
      setState((s) => ({ ...s, error: `Max reconnection attempts (${maxReconnects}) reached.` }));
      return;
    }
    attemptsRef.current += 1;

    const url = buildRiderWsUrl(phone);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setState({ connected: true, lastMessage: null, error: null });
      attemptsRef.current = 0;
    };

    ws.onmessage = (e) => {
      if (!mountedRef.current) return;
      try {
        const msg = JSON.parse(e.data) as RawPushMessage;
        setState((s) => ({ ...s, lastMessage: msg }));
      } catch {
        // ignore non-JSON frames
      }
    };

    ws.onerror = () => {
      if (!mountedRef.current) return;
      setState((s) => ({ ...s, error: "WebSocket error" }));
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setState((s) => ({ ...s, connected: false }));
      if (attemptsRef.current < maxReconnects && !disabled) {
        const delay = 1000 * attemptsRef.current;
        setTimeout(() => mountedRef.current && connect(), delay);
      }
    };
  }, [phoneNumber, maxReconnects, disabled]);

  useEffect(() => {
    mountedRef.current = true;

    if (!startedRef.current && !disabled) {
      startedRef.current = true;
      connect();
    }

    return () => {
      mountedRef.current = false;
      startedRef.current = false;
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
    };
  }, [connect, disabled]);

  return state;
}
