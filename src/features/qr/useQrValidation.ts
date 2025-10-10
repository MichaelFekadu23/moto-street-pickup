import { useEffect, useMemo, useState } from 'react';
import { requestJSON } from '../../lib/api';
import type { QRValidateWrappedAPI, QRError } from './types';
import { normalizeQR, mapInvalidMessageToError } from './normalize';

import { useDriver, useRide } from '../ride/rideContext';

export function useQrValidation(token: string) {
  const [validating, setValidating] = useState(false);
  const [qrError, setQrError] = useState<QRError | null>(null);

  // get/set global profile so it can be reused across screens
  const { profile: globalProfile, setProfile: setGlobalProfile, setToken: setGlobalToken } = useDriver();
  const { language } = useRide();

  // 1) Fetch ONLY when token changes (not on language changes)
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

        const raw = await requestJSON<QRValidateWrappedAPI>(`/qr/validate/${token}`, { method: 'GET' });
        if (cancelled) return;

        const r = normalizeQR(raw);
        console.log('QR validation result:', r);
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

        // cache globally; no language-specific fields here
        setGlobalToken(token);
        setGlobalProfile({
          driverId: r.driverProfile.driverId,
          driverName: r.driverProfile.driverName,
          driverNameAm: r.driverProfile.driverNameAm, // ok if undefined
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
  }, [token]); // <-- language removed

  // 2) Derive UI strings from cached profile; re-run on language or profile change
  const driverName = useMemo(() => {
    if (!globalProfile) return '—';
    if (language === 'en') return globalProfile.driverName || '—';
    return globalProfile.driverNameAm || globalProfile.driverName || '—';
  }, [language, globalProfile]);

  const plateNumber = useMemo(() => globalProfile?.plateNumber || '—', [globalProfile]);

  return { driverName, plateNumber, validating, qrError };
}
