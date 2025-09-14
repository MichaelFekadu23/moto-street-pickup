import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type RiderInfo = {
  name: string;
  phone: string;
};

type RiderState = {
  rider: RiderInfo | null;
  setRider: (r: RiderInfo | null) => void;
  clear: () => void;
};

const RiderContext = createContext<RiderState | undefined>(undefined);

const STORAGE_KEY = 'moto_rider_info';

function loadFromStorage(): RiderInfo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as RiderInfo;
    if (!obj?.name) return null;
    return obj;
  } catch {
    return null;
  }
}

function saveToStorage(r: RiderInfo | null) {
  try {
    if (!r) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
  } catch {}
}

export function RiderProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(loadFromStorage, []);
  const [rider, setRiderState] = useState<RiderInfo | null>(initial);

  useEffect(() => {
    saveToStorage(rider);
  }, [rider]);

  const setRider = useCallback((r: RiderInfo | null) => setRiderState(r), []);
  const clear = useCallback(() => setRiderState(null), []);

  const value = useMemo<RiderState>(() => ({ rider, setRider, clear }), [rider, setRider, clear]);
  return React.createElement(RiderContext.Provider, { value }, children);
}

export function useRider() {
  const ctx = useContext(RiderContext);
  if (!ctx) throw new Error('useRider must be used within <RiderProvider>');
  return ctx;
}
