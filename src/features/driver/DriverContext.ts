import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type DriverProfile = {
  driverId: string;
  driverName: string;
  vehicleModel: string;
  plateNumber: string;
  photoUrl: string;
  streetModeActive: boolean;
};

type DriverState = {
  profile: DriverProfile | null;
  token: string | null;     // qr_token if you want it available elsewhere
  setProfile: (p: DriverProfile | null) => void;
  setToken: (t: string | null) => void;
  clear: () => void;
};

const DriverContext = createContext<DriverState | undefined>(undefined);

const STORAGE_KEY = 'moto_driver_profile';
const STORAGE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

type Persisted = { profile: DriverProfile | null; token: string | null; ts: number };

function loadFromStorage(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Persisted;
    if (!obj || !obj.ts) return null;
    if (Date.now() - obj.ts > STORAGE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return obj;
  } catch {
    return null;
  }
}

function saveToStorage(profile: DriverProfile | null, token: string | null) {
  try {
    const payload: Persisted = { profile, token, ts: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

export function DriverProvider({ children }: { children: React.ReactNode }) {
  const persisted = useMemo(() => loadFromStorage(), []);
  const [profile, setProfileState] = useState<DriverProfile | null>(persisted?.profile ?? null);
  const [token, setTokenState] = useState<string | null>(persisted?.token ?? null);

  useEffect(() => {
    saveToStorage(profile, token);
  }, [profile, token]);

  const setProfile = useCallback((p: DriverProfile | null) => setProfileState(p), []);
  const setToken   = useCallback((t: string | null) => setTokenState(t), []);
  const clear      = useCallback(() => { setProfileState(null); setTokenState(null); }, []);

  const value: DriverState = { profile, token, setProfile, setToken, clear };
  return React.createElement(DriverContext.Provider, { value }, children);
}

export function useDriver() {
  const ctx = useContext(DriverContext);
  if (!ctx) throw new Error('useDriver must be used within <DriverProvider>');
  return ctx;
}
