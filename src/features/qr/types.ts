// Raw API
export type DriverProfileAPI = {
  driver_id: string;
  driver_name: string;
  vehicle_model: string;
  plate_number: string;
  photo_url: string;
  street_mode_active: boolean;
};

export type QRValidateWrappedAPI = {
  ok: boolean;
  data: {
    valid: boolean;
    message: string;
    driver_profile?: DriverProfileAPI;
  };
};

// Normalized UI
export type DriverProfile = {
  driverId: string;
  driverName: string;
  vehicleModel: string;
  plateNumber: string;
  photoUrl: string;
  streetModeActive: boolean;
};

export type QRNormalized = {
  valid: boolean;
  message: string;
  driverProfile?: DriverProfile;
};

// Error surface for the banner
export type QRError = { code: string; message: string };
