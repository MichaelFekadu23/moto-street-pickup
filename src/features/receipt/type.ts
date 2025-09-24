// src/types/Receipt.ts
export type Receipt = {
  currency: "ETB" | string;
  distance: number;
  driver_id: string;
  driver_name: string;
  duration: number; // minutes
  end_location: string;   // "Lat: 9.045, Lng: 38.760"
  end_time: string;       // ISO
  fare: number;
  generated_at: string;   // ISO
  payment_method: "cash" | "card" | "telebirr" | string;
  plate_number: string;
  ride_id: string;
  rider_name: string;
  start_location: string;
  start_time: string;     // ISO
  vehicle_model: string;
};