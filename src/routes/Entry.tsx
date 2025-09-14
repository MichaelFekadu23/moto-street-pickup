// routes/Entry.tsx
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';

import MainContentWrapper from '../components/MianContentWrapper';
import PrimaryButton from '../components/PrimaryButton';
import LogoAndDriverInfo from '../components/LogoAndDriverInfo';
import InputField from '../components/InputField';
import Footer from '../components/Footer';
import logo from '../assets/logo.svg';

import { useQrValidation } from '../features/qr/useQrValidation';
import { useDriver } from '../features/driver/DriverContext';
import { initiateStreetRide } from '../features/rides/initiate';
import { isApiError } from '../features/common/apiError';
import { useRider } from '../features/rider/riderContext';

type FormValues = { name: string; phone: string };

const readLS = (k: string) => {
  try {
    const v = localStorage.getItem(k);
    return v && v !== 'null' && v !== 'undefined' ? v : '';
  } catch {
    return '';
  }
};

const backendToFormField: Record<string, 'name' | 'phone' | 'root'> = {
  rider_name: 'name',
  phone: 'phone',
  driver_id: 'root',
};

const Entry = () => {
  const navigate = useNavigate();
  const { setRider } = useRider();
  const [sp] = useSearchParams();

  // supports ?qr_token=..., ?code=..., or ?token=...
  const token = useMemo(
    () => sp.get('qr_token') ?? sp.get('code') ?? sp.get('token') ?? '',
    [sp]
  );

  const { driverName, plateNumber, validating, qrError } = useQrValidation(token);
  const { profile: driverProfile } = useDriver();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    setError,
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

  const onSubmit: SubmitHandler<FormValues> = async ({ name, phone }) => {
    // must have a driver profile (QR validated)
    if (!driverProfile?.driverId) {
      setError('root' as any, { type: 'manual', message: 'Driver not loaded yet. Please rescan the QR.' });
      return;
    }

    // persist rider info
    localStorage.setItem('moto_name', name);
    localStorage.setItem('moto_phone', phone);
    setRider({ name, phone });

    try {
      const ride = await initiateStreetRide({
        driver_id: driverProfile.driverId,
        phone,
        rider_name: name,
      });

      localStorage.setItem('moto_rideId', ride.rideId);
      navigate(`/awaiting?rideId=${encodeURIComponent(ride.rideId)}`);
    } catch (e: any) {
      if (isApiError(e)) {
        if (e.field_error?.length) {
          for (const fe of e.field_error) {
            const field = backendToFormField[fe.name] ?? 'root';
            setError(field as any, { type: 'server', message: fe.description || e.message });
          }
        } else {
          setError('root' as any, { type: 'server', message: e.message });
        }
      } else {
        setError('root' as any, { type: 'server', message: 'Failed to start ride. Please try again.' });
      }
    }
  };

  return (
    <MainContentWrapper>
      {validating ? (
        <div className="flex flex-col items-center justify-center w-full mt-8">
          <img src={logo} alt="Logo" className="w-[120px] h-[27.72px]" />
          <div className="mt-10 flex flex-col items-center justify-center w-full py-12 rounded-md max-w-sm text-center text-sm text-gray-300">
            <div className="flex justify-center items-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
            <div className="mt-4 font-semibold text-[14px] uppercase">Validating QR code...</div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center w-full mt-8">
            <LogoAndDriverInfo
              showDriverInfo={!qrError?.code}
              className="flex flex-col items-center justify-center"
              driverName={driverName}
              plateNumber={plateNumber}
            />
          </div>

          {/* QR error/banner */}
          {!!qrError?.code && (
            <div
              className={`mt-10 w-full py-12 px-3 font-semibold text-[14px] uppercase rounded-md max-w-sm text-center
                ${
                  qrError.code === 'QR_NOT_FOUND' || qrError.code === 'MISSING_QR'
                    ? 'text-red-400'
                    : qrError.code === 'DRIVER_UNAVAILABLE'
                    ? 'text-yellow-300'
                    : 'text-gray-300'
                }`}
            >
              {qrError.message}
            </div>
          )}

          {/* Form */}
          {!qrError?.code && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-sm space-y-8 flex-shrink-0"
              noValidate
            >
              <InputField<FormValues>
                id="name"
                name='name'
                type="text"
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
                name='phone'
                type="tel"
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

              {/* Optional root-level error display (doesn't change layout) */}
              {errors.root?.message && (
                <div className="text-red-400 text-sm font-medium -mt-2">{String(errors.root.message)}</div>
              )}

              <div className="flex flex-col w-full items-center justify-center gap-3 flex-shrink-0">
                <PrimaryButton
                  title="Start Ride"
                  type="submit"
                  onclick={() => {}}
                  disabled={!isValid}
                  loading={isSubmitting}
                />
                <Footer text="Powered by Moto street pickup" />
              </div>
            </form>
          )}
        </>
      )}
    </MainContentWrapper>
  );
};

export default Entry;
