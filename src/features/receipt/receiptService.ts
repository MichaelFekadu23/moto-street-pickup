// src/services/receiptService.ts
const BASE = import.meta.env.VITE_API_BASE_URL; // e.g. https://…/v1

export async function fetchReceipt(rideId: string) {
  const res = await fetch(`${BASE}/street-ride/receipt/${encodeURIComponent(rideId)}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Receipt fetch failed (${res.status}): ${msg}`);
  }
  return (await res.json()) as import("./type").Receipt;
}

/*

const BASE = import.meta.env.VITE_API_BASE_URL; // e.g. https://…/v1

export async function fetchReceipt(rideId: string) {
  // Mock response
  const mockResponse = {
    currency: "ETB",
    distance: 5.2,
    driver_id: "D1234",
    driver_name: "John Doe",
    duration: 25,
    end_location: "Lat: 9.045, Lng: 38.760",
    end_time: "2024-08-31T12:30:00Z",
    fare: 85,
    generated_at: "2024-08-31T12:35:00Z",
    payment_method: "cash",
    plate_number: "AB1234",
    ride_id: "RIDE_ABC12345",
    rider_name: "Abel Tesfaye",
    start_location: "Lat: 9.032, Lng: 38.747",
    start_time: "2024-08-31T12:00:00Z",
    vehicle_model: "Toyota Vitz",
  };

  // Simulate a delay to mimic an API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockResponse as import("./type").Receipt;
}
*/