import type { DriverProfile, QRNormalized, QRValidateWrappedAPI } from './types';

export function normalizeQR(raw: QRValidateWrappedAPI): QRNormalized {
  // Support new (root-level) response and old (wrapped in `data`) response
  const payload: any = (raw as any)?.data ?? (raw as any);

  const valid = !!payload?.valid;
  const message: string = payload?.message ?? '';

  const dp = payload?.driver_profile;
  const driverProfile: DriverProfile | undefined = dp
    ? {
        driverId: dp.driver_id,
        driverName: dp.driver_name,
        // If you later add this to DriverProfile, map it here:
        driverNameAm: dp.driver_name_am,
        vehicleModel: dp.vehicle_model,
        plateNumber: dp.plate_number,
        photoUrl: dp.photo_url,
        streetModeActive: !!dp.street_mode_active,
      }
    : undefined;

  return { valid, message, driverProfile };
}

// Map backend invalid states to UI error codes (kept as-is; extend if backend adds new messages)
export function mapInvalidMessageToError(message: string) {
  const msg = (message || '').toLowerCase();
  if (msg.includes('qr code not found')) {
    return { code: 'QR_NOT_FOUND', message: 'QR code not found' };
  }
  if (msg.includes('driver unavailable')) {
    return {
      code: 'DRIVER_UNAVAILABLE',
      message: 'This driver is currently unavailable for street pickup.',
    };
  }
  return { code: 'QR_INVALID', message: message || 'Invalid QR code.' };
}
