// Build URLs safely; auto-encodes '+' etc.

export function buildRiderWsUrl(phoneNumber: string): string {
  const base = new URL(import.meta.env.VITE_API_BASE_URL as string);
  const u = new URL(base.pathname.replace(/\/+$/, "") + "/ws/rider", `${base.protocol}//${base.host}`);
  u.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  u.searchParams.set("phone", (phoneNumber ?? "").trim()); // encodes '+'
  return u.toString();
}

export function buildRideSessionUrl(rideId: string): string {
  const base = new URL(import.meta.env.VITE_API_BASE_URL as string);
  const u = new URL(base.pathname.replace(/\/+$/, "") + `/ride-session/${rideId}`, `${base.protocol}//${base.host}`);
  u.protocol = base.protocol; // https/http
  return u.toString();
}
