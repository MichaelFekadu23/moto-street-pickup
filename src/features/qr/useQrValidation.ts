import { useEffect, useState } from 'react';
import { requestJSON } from '../../lib/api';
import type { QRValidateWrappedAPI, QRError } from './types';
import { normalizeQR, mapInvalidMessageToError } from './normalize';

import { useDriver } from '../driver/DriverContext';

export function useQrValidation(token: string) {
  const [driverName, setDriverName] = useState('—');
  const [plateNumber, setPlateNumber] = useState('—');
  const [validating, setValidating] = useState(false);
  const [qrError, setQrError] = useState<QRError | null>(null);
  const { setProfile: setGlobalProfile, setToken: setGlobalToken } = useDriver();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!token) {
        setQrError({ code: 'MISSING_QR', message: 'Missing QR code. Please scan again.' });
        return;
      }

      try {
        setValidating(true);
        setQrError(null);

        const raw = await requestJSON<QRValidateWrappedAPI>('/street/validate-qr', {
          method: 'POST',
          body: { qr_token: token },
        });
        if (cancelled) return;

        const r = normalizeQR(raw);

        if (!r.valid) {
          setQrError(mapInvalidMessageToError(r.message));
          return;
        }

        if (!r.driverProfile) {
          setQrError({ code: 'MISSING_PROFILE', message: 'Driver profile is missing.' });
          return;
        }

        if (r.driverProfile.streetModeActive === false) {
          setQrError({
            code: 'DRIVER_UNAVAILABLE',
            message: 'This driver is currently unavailable for street pickup.',
          });
          return;
        }

        setDriverName(r.driverProfile.driverName || '—');
        setPlateNumber(r.driverProfile.plateNumber || '—');

        setGlobalToken(token); // pass token from hook caller if you want it stored
        setGlobalProfile({
          driverId: r.driverProfile.driverId,
          driverName: r.driverProfile.driverName,
          vehicleModel: r.driverProfile.vehicleModel,
          plateNumber: r.driverProfile.plateNumber,
          photoUrl: r.driverProfile.photoUrl,
          streetModeActive: r.driverProfile.streetModeActive,
        });
      } catch (e: any) {
        if (!cancelled) {
          const code = String(e?.code ?? e?.status ?? 'HTTP_ERROR');
          const message = e?.message ?? 'Failed to validate QR.';
          setQrError({ code, message });
        }
      } finally {
        if (!cancelled) setValidating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return { driverName, plateNumber, validating, qrError };
}
