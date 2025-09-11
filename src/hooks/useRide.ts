// src/hooks/useRide.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { StreetAPI, type RideSession, type Fare } from '../services/streetPickupApi';

type RideState = {
  session?: RideSession;
  fare?: Fare;
  loading: boolean;
  error?: string;
};

export function useRide() {
  const [state, set] = useState<RideState>({ loading: false });
  const pollRef = useRef<number | null>(null);
  const watchRef = useRef<number | null>(null);

  const startPolling = useCallback((rideId: string) => {
    stopPolling();
    pollRef.current = window.setInterval(async () => {
      try {
        const session = await StreetAPI.getSession(rideId);
        set(s => ({ ...s, session }));
      } catch {}
    }, 2500);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const startGPS = useCallback((rideId: string) => {
    stopGPS();
    watchRef.current = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        StreetAPI.postGPS(rideId, latitude, longitude).catch(() => {});
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  }, []);

  const stopGPS = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
  }, []);

  const validateQRAndInitiate = useCallback(async (token: string, name: string, phone: string) => {
    set({ loading: true });
    try {
      await StreetAPI.validateQRByToken(token); // or validateQRRaw
      const session = await StreetAPI.riderInitiate({ token, name, phone });
      set({ loading: false, session });
      localStorage.setItem('moto_rideId', session.rideId);
      startPolling(session.rideId);
      return session;
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? 'Failed to start ride' });
      throw e;
    }
  }, [startPolling]);

  const handleDriverConfirmed = useCallback((rideId: string) => {
    startGPS(rideId);
  }, [startGPS]);

  const endRide = useCallback(async (rideId: string) => {
    set(s => ({ ...s, loading: true }));
    try {
      const session = await StreetAPI.endRide(rideId);
      stopGPS();
      const fare = await StreetAPI.getFare(rideId);
      set({ loading: false, session, fare });
      stopPolling();
      return { session, fare };
    } catch (e: any) {
      set(s => ({ ...s, loading: false, error: e?.message ?? 'Failed to end ride' }));
      throw e;
    }
  }, [stopGPS, stopPolling]);

  useEffect(() => {
    // Resume if a ride is in progress
    const saved = localStorage.getItem('moto_rideId');
    if (saved) startPolling(saved);
    return () => { stopPolling(); stopGPS(); };
  }, [startPolling, stopGPS, stopPolling]);

  return { state, validateQRAndInitiate, handleDriverConfirmed, endRide };
}
