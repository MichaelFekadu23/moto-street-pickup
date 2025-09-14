// WS URL builders based on VITE_API_BASE_URL (which already includes /v1)

const RAW = import.meta.env.VITE_API_BASE_URL as string; // e.g. http://ec2-…/v1

function normalizeBase(url: string) {
  if (!/^https?:\/\//i.test(url)) return `http://${url}`;
  return url;
}

function baseToWs(origin: URL) {
  return origin.protocol === 'https:' ? 'wss:' : 'ws:';
}

// Rider-scoped WS (ideal): /v1/ws/ride?ride_id=...
export function buildRideWsUrl(rideId: string) {
  const base = new URL(normalizeBase(RAW));
  const wsProto = baseToWs(base);
  const trimmed = base.pathname.replace(/\/+$/, '');
  const path = trimmed === '/v1' ? '/v1/ws/ride' : `${trimmed}/ws/ride`;
  return `${wsProto}//${base.host}${path}?ride_id=${encodeURIComponent(rideId)}`;
}

// (Existing) driver WS, if you ever need it on rider side (usually not)
// export function buildDriverWsUrl(driverId: string) { ... }
