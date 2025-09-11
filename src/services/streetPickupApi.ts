// src/services/streetPickupApi.ts
import { fetchJSON } from '../lib/http';

export type QRValidation = {
  driverId: string; driverName: string; plateNumber: string;
  vehicleModel?: string; qrStatus: 'ACTIVE'|'INACTIVE'|'EXPIRED';
};

export type RideSession = {
  rideId: string; status: 'PENDING_DRIVER'|'IN_PROGRESS'|'COMPLETED'|'CANCELLED';
  driverId: string; startedAt?: string; endedAt?: string;
};

export type Fare = {
  distanceKm: number; timeMin: number; baseFare: number; total: number; currency?: string;
};

export const StreetAPI = {
  // 1) Validate QR (POST)
  validateQRByToken: (token: string) =>
    fetchJSON<QRValidation>(`/v1/street/validate-qr`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    }),

  // 1-alt) Validate QR (GET, no body/headers) — avoids preflight
  validateQRRaw: (token: string) =>
    fetchJSON<QRValidation>(`/v1/qr/validate/${encodeURIComponent(token)}`, {
      method: 'GET',
      // no body, no custom headers
    }),

  // 2) Rider initiate
  riderInitiate: (args: { token: string; name: string; phone: string }) =>
    fetchJSON<RideSession>(`/v1/rider/initiate`, {
      method: 'POST',
      body: JSON.stringify(args),
    }),

  // 3) Driver confirm start
  confirmStart: (rideId: string) =>
    fetchJSON<RideSession>(`/v1/street-ride/confirm`, {
      method: 'POST',
      body: JSON.stringify({ rideId }),
    }),

  // 4) GPS logging + logs
  postGPS: (rideId: string, lat: number, lng: number, ts: number = Date.now()) =>
    fetchJSON<{ ok: true }>(`/v1/street-ride/gps`, {
      method: 'POST',
      body: JSON.stringify({ rideId, lat, lng, ts }),
    }),

  getGPSLogs: (rideId: string) =>
    fetchJSON<Array<{ lat: number; lng: number; ts: number }>>(
      `/v1/street-ride/${encodeURIComponent(rideId)}/gps`,
      { method: 'GET' },
    ),

  // Session read / patch
  getSession: (rideId: string) =>
    fetchJSON<RideSession>(`/v1/ride-session/${encodeURIComponent(rideId)}`, { method: 'GET' }),

  updateStatus: (rideId: string, status: RideSession['status']) =>
    fetchJSON<RideSession>(`/v1/ride-session/${encodeURIComponent(rideId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // 5) End ride + 6) Fare
  endRide: (rideId: string) =>
    fetchJSON<RideSession>(`/v1/street-ride/end`, {
      method: 'POST',
      body: JSON.stringify({ rideId }),
    }),

  getFare: (rideId: string) =>
    fetchJSON<Fare>(`/v1/street-ride/fare/${encodeURIComponent(rideId)}`, { method: 'GET' }),
};
