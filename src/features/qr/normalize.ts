import type { DriverProfile, QRNormalized, QRValidateWrappedAPI } from './types';

export function normalizeQR(raw: QRValidateWrappedAPI): QRNormalized {
  const { valid, message, driver_profile } =
    raw?.data ?? { valid: false as boolean, message: '' as string };

  const driverProfile: DriverProfile | undefined = driver_profile
    ? {
        driverId: driver_profile.driver_id,
        driverName: driver_profile.driver_name,
        vehicleModel: driver_profile.vehicle_model,
        plateNumber: driver_profile.plate_number,
        photoUrl: driver_profile.photo_url,
        streetModeActive: !!driver_profile.street_mode_active,
      }
    : undefined;

  return { valid: !!valid, message: message ?? '', driverProfile };
}

// Map backend invalid states to UI error codes
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
