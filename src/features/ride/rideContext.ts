import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type DriverProfile = {
  driverId: string;
  driverName: string;
  driverNameAm?: string;
  vehicleModel: string;
  plateNumber: string;
  photoUrl: string;
  streetModeActive: boolean;
};

export type RiderInfo = {
  name: string;
  phone: string;
};

export type RideData = {
  rideId: string;
  rider: RiderInfo;
  driver: DriverProfile;
  createdAt: number;
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
};

export type Language = 'en' | 'am';

type RideState = {
  ride: RideData | null;
  rideId: string | null;
  rider: RiderInfo | null;
  driver: DriverProfile | null;
  token: string | null;
  language: Language;
  setRide: (ride: RideData | null) => void;
  setRideId: (rideId: string | null) => void;
  setRider: (rider: RiderInfo | null) => void;
  setDriver: (driver: DriverProfile | null) => void;
  setToken: (token: string | null) => void;
  setLanguage: (language: Language) => void;
  createRide: (rideId: string, rider: RiderInfo, driver: DriverProfile) => void;
  clear: () => void;
  clearRide: () => void;
};

const RideContext = createContext<RideState | undefined>(undefined);

const STORAGE_KEY = 'moto_ride_data';
const LANGUAGE_KEY = 'moto_language';
const STORAGE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

type Persisted = {
  ride: RideData | null;
  rider: RiderInfo | null;
  driver: DriverProfile | null;
  token: string | null;
  ts: number;
};

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

function loadLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'en' || saved === 'am') return saved;
    // Default to English
    return 'en';
  } catch {
    return 'en';
  }
}

function saveToStorage(ride: RideData | null, rider: RiderInfo | null, driver: DriverProfile | null, token: string | null) {
  try {
    const payload: Persisted = { ride, rider, driver, token, ts: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

function saveLanguage(language: Language) {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {}
}

export function RideProvider({ children }: { children: React.ReactNode }) {
  const persisted = useMemo(() => loadFromStorage(), []);
  const initialLanguage = useMemo(() => loadLanguage(), []);
  
  const [ride, setRideState] = useState<RideData | null>(persisted?.ride ?? null);
  const [rider, setRiderState] = useState<RiderInfo | null>(persisted?.rider ?? null);
  const [driver, setDriverState] = useState<DriverProfile | null>(persisted?.driver ?? null);
  const [token, setTokenState] = useState<string | null>(persisted?.token ?? null);
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Derived state
  const rideId = ride?.rideId ?? null;

  useEffect(() => {
    saveToStorage(ride, rider, driver, token);
  }, [ride, rider, driver, token]);

  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  const setRide = useCallback((r: RideData | null) => {
    setRideState(r);
    if (r) {
      setRiderState(r.rider);
      setDriverState(r.driver);
    }
  }, []);

  const setRideId = useCallback((id: string | null) => {
    if (!id) {
      setRideState(null);
      return;
    }
    
    if (rider && driver) {
      const newRide: RideData = {
        rideId: id,
        rider,
        driver,
        createdAt: Date.now(),
        status: 'pending'
      };
      setRideState(newRide);
    }
  }, [rider, driver]);

  const setRider = useCallback((r: RiderInfo | null) => {
    setRiderState(r);
    // If we have an active ride, update it
    if (ride && r) {
      setRideState({ ...ride, rider: r });
    }
  }, [ride]);

  const setDriver = useCallback((d: DriverProfile | null) => {
    setDriverState(d);
    // If we have an active ride, update it
    if (ride && d) {
      setRideState({ ...ride, driver: d });
    }
  }, [ride]);

  const setToken = useCallback((t: string | null) => setTokenState(t), []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const createRide = useCallback((rideId: string, riderInfo: RiderInfo, driverProfile: DriverProfile) => {
    const newRide: RideData = {
      rideId,
      rider: riderInfo,
      driver: driverProfile,
      createdAt: Date.now(),
      status: 'pending'
    };
    setRideState(newRide);
    setRiderState(riderInfo);
    setDriverState(driverProfile);
  }, []);

  const clear = useCallback(() => {
    setRideState(null);
    setRiderState(null);
    setDriverState(null);
    setTokenState(null);
    // Note: language preference is preserved even after clearing ride data
  }, []);

  const clearRide = useCallback(() => {
    setRideState(null);
  }, []);

  const value: RideState = {
    ride,
    rideId,
    rider,
    driver,
    token,
    language,
    setRide,
    setRideId,
    setRider,
    setDriver,
    setToken,
    setLanguage,
    createRide,
    clear,
    clearRide
  };

  return React.createElement(RideContext.Provider, { value }, children);
}

export function useRide() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error('useRide must be used within <RideProvider>');
  return ctx;
}

// Convenience hooks for backward compatibility
export function useDriver() {
  const { driver, setDriver, token, setToken, clear } = useRide();
  return {
    profile: driver,
    token,
    setProfile: setDriver,
    setToken,
    clear
  };
}

export function useRider() {
  const { rider, setRider, clear } = useRide();
  return {
    rider,
    setRider,
    clear
  };
}

// New convenience hook for language
export function useLanguage() {
  const { language, setLanguage } = useRide();
  return {
    language,
    setLanguage
  };
}