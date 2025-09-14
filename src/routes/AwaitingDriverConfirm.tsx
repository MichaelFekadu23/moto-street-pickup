import MainContentWrapper from '../components/MianContentWrapper';
import LogoAndDriverInfo from '../components/LogoAndDriverInfo';
import Footer from '../components/Footer';
import RippleAvatar from '../components/RippleAvatar';
import { useNavigate } from 'react-router-dom';
import { useDriver } from '../features/driver/DriverContext';
import { useAwaitingDriverAcceptHybrid } from '../features/rideStatus/useAwaitingDriverAcceptHybrid';

const AwaitingDriverConfirm = () => {
  const { profile } = useDriver();
  const navigate = useNavigate();

  const rideId = localStorage.getItem('moto_rideId') || '';

  const { status, wsConnected } = useAwaitingDriverAcceptHybrid({
    rideId,
    onAccepted: () => navigate('/trip'),
    onRejected: () => navigate('/ride-rejected'),
    pollMs: 2000,
    usePollingFallback: true, // set to false if you want WS-only
  });
  console.log('Ride status:', status, 'WS connected:', wsConnected);

  return (
    <MainContentWrapper>
      {/* Driver summary */}
      <div className="flex items-center justify-center w-full mt-8">
        <LogoAndDriverInfo
          className="flex flex-col items-center justify-center"
          driverName={profile?.driverName || '—'}
          plateNumber={profile?.plateNumber || '—'}
        />
      </div>

      {/* Avatar + message */}
      <div className="flex flex-col items-center justify-center">
        <RippleAvatar />
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-white text-center">
          <p className="font-semibold text-[20px] uppercase">AWAITING DRIVER</p>
          <p className="font-semibold text-[20px] uppercase">CONFIRMATION!</p>
          {/* <p className="text-xs opacity-70 mt-2">{wsConnected ? 'Live via WebSocket' : 'Using fallback'}</p>
          <p className="text-xs opacity-70">{`Status: ${status}`}</p> */}
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <Footer text="Powered by Moto street pickup" />
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default AwaitingDriverConfirm;
