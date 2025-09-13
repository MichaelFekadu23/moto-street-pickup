// routes/Entry.tsx
import MainContentWrapper from '../components/MianContentWrapper';
import PrimaryButton from '../components/PrimaryButton';
import LogoAndDriverInfo from '../components/LogoAndDriverInfo';
import InputField from '../components/InputField';
import Footer from '../components/Footer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

type FormValues = { name: string; phone: string };

const API = import.meta.env.VITE_API_BASE_URL;

// ---------- helpers ----------
async function postJSON<T>(path: string, body: unknown, timeoutMs = 15000): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.message || `HTTP ${res.status}`);
    return data as T;
  } finally {
    clearTimeout(t);
  }
}

const readLS = (k: string) => {
  try {
    const v = localStorage.getItem(k);
    return v && v !== 'null' && v !== 'undefined' ? v : '';
  } catch {
    return '';
  }
};

// ---------- API shapes & normalizer ----------
type DriverProfileAPI = {
  driver_id: string;
  driver_name: string;
  plate_number: string;
  vehicle_model?: string;
  photo_url?: string;
  street_mode_active?: boolean;
};

type QRFlatAPI = {
  valid: boolean;
  message: string;
  driver_profile?: DriverProfileAPI;
};

type QRWrappedAPI = {
  ok: boolean;
  data: QRFlatAPI;
};

type QRNormalized = {
  valid: boolean;
  message: string;
  driver?: {
    driverId: string;
    driverName: string;
    plateNumber: string;
    vehicleModel?: string;
    photoUrl?: string;
    streetModeActive?: boolean;
  };
};

function normalizeQR(raw: QRWrappedAPI | QRFlatAPI): QRNormalized {
  const payload: QRFlatAPI = (raw as QRWrappedAPI).data ? (raw as QRWrappedAPI).data : (raw as QRFlatAPI);
  const dp = payload.driver_profile;
  return {
    valid: Boolean(payload.valid),
    message: payload.message ?? '',
    driver: dp
      ? {
          driverId: dp.driver_id,
          driverName: dp.driver_name,
          plateNumber: dp.plate_number,
          vehicleModel: dp.vehicle_model,
          photoUrl: dp.photo_url,
          streetModeActive: dp.street_mode_active,
        }
      : undefined,
  };
}

// type InitiateResp = {
//   rideId: string;
//   status: 'PENDING_DRIVER' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
//   driverId: string;
// };

const Entry = () => {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const token = useMemo(() => sp.get('code') ?? '', [sp]);

  const [driverName, setDriverName] = useState('—');
  const [plateNumber, setPlateNumber] = useState('—');
  const [qrError, setQrError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: readLS('moto_name'),
      phone: readLS('moto_phone'),
    },
  });

  // Ensure fields populate from localStorage on mount
  useEffect(() => {
    reset({
      name: readLS('moto_name'),
      phone: readLS('moto_phone'),
    });
  }, [reset]);

  // Validate QR and load driver info
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) { setQrError('Missing QR code. Please scan again.'); return; }
      try {
        setValidating(true);
        setQrError(null);

        // Accept either wrapped or flat swagger payloads
        const raw = await postJSON<QRWrappedAPI | QRFlatAPI>('/street/validate-qr', { token });
        const r = normalizeQR(raw);
        if (cancelled) return;

        if (!r.valid) {
          setQrError(r.message || 'Invalid QR code.');
          return;
        }
        if (r.driver && r.driver.streetModeActive === false) {
          setQrError('This driver is currently unavailable for street pickup.');
          return;
        }

        setDriverName(r.driver?.driverName ?? '—');
        setPlateNumber(r.driver?.plateNumber ?? '—');
      } catch (e: any) {
        if (!cancelled) setQrError(e?.message ?? 'Failed to validate QR.');
      } finally {
        if (!cancelled) setValidating(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const onSubmit: SubmitHandler<FormValues> = async ({ name, phone }) => {
    console.log('Submitting', { name, phone });
    // persist for returning riders
    localStorage.setItem('moto_name', name);
    localStorage.setItem('moto_phone', phone);

    // const resp = await postJSON<InitiateResp>('/rider/initiate', { token, name, phone });
    const resp = { rideId: 'test-ride-id-12345', status: 'PENDING_DRIVER', driverId: 'driver-123' }; // TODO: remove mock
    localStorage.setItem('moto_rideId', resp.rideId);
    navigate(`/awaiting?rideId=${encodeURIComponent(resp.rideId)}`);
  };

  const disableForm = !!qrError || validating;
  console.log(disableForm);

  return (
    <MainContentWrapper>
      {/* Driver info */}
      <div className="flex items-center justify-center w-full mt-8">
        <LogoAndDriverInfo
          className="flex flex-col items-center justify-center"
          driverName={driverName}
          plateNumber={plateNumber}
        />
      </div>

      {/* QR error/banner */}
      {/* {!!qrError && (
        <div className="mt-4 w-full max-w-sm text-center text-sm text-red-400">
          {qrError}
        </div>
      )} */}

      {/* Form */}
      {!!qrError && <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-8 flex-shrink-0"
        noValidate
      >
        <InputField<FormValues>
          id="name" 
          type="text"
          name='name'
          label="Name"
          register={register}
          rules={{
            required: 'Name is required',
            minLength: { value: 2, message: 'At least 2 characters' },
          }}
          error={errors.name}
        />

        <InputField<FormValues>
          id="phone"
          type="tel"
          name='phone'
          inputMode="tel"
          label="Phone"
          register={register}
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^\+?\d{9,15}$/,
              message: 'Enter a valid phone number',
            },
          }}
          error={errors.phone}
        />

        {/* Buttons and Footer */}
        <div className="flex flex-col w-full items-center justify-center gap-3 flex-shrink-0">
          <PrimaryButton
            title={
              'Start Ride'
            }
            type="submit"
            onclick={() => {}}
            disabled={!isValid || isSubmitting }
          />
          <Footer text="Powered by Moto street pickup" />
        </div>
      </form>
      }
    </MainContentWrapper>
  );
};

export default Entry;
