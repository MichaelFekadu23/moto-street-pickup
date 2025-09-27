export interface Receipt {
  currency: string;
  distance: number;
  driver_id: string;
  driver_name: string;
  duration: number;
  end_location: string;
  end_time: string;
  fare: number;
  generated_at: string;
  payment_method: string;
  plate_number: string;
  ride_id: string;
  rider_name: string;
  start_location: string;
  start_time: string;
  vehicle_model: string;
}