import { useEffect } from "react";
import MainContentWrapper from "../components/MianContentWrapper";
import LogoAndDriverInfo from "../components/LogoAndDriverInfo";
import Footer from "../components/Footer";
import RippleAvatar from "../components/RippleAvatar";
import { useNavigate } from "react-router-dom";
import { useDriver } from "../features/ride/rideContext";
import { useRide } from "../features/ride/rideContext";
import { useRideStatus } from "../features/rideStatus/useRideStatus";

const AwaitingDriverConfirm = () => {
  const navigate = useNavigate();
  const { profile } = useDriver();
  const { rider, ride } = useRide();

  const rideId = localStorage.getItem("moto_rideId") || ride?.rideId || "";
  const phoneNumber = (localStorage.getItem("moto_phone") || rider?.phone || "").trim();

  const { status, wsConnected, wsError, pollError } = useRideStatus({
    rideId,
    phoneNumber,
    pollMs: 3000,
    usePollingFallback: true,
    disableWebSocket: false,
  });

  console.log("[AwaitingDriverConfirm] status:", status, "ws:", wsConnected, "wsErr:", wsError, "pollErr:", pollError);

  // Navigate based on status (inside effect; avoid doing this in render)
  useEffect(() => {
    if (status === "en_route" || status === "in_progress") {
      navigate("/trip");
    } else if (status === "rejected") {
      navigate("/ride-rejected");
    } else if (status === "cancelled") {
      navigate("/ride-cancelled");
    } else if (status === "trip_completed") {
      navigate("/trip-completed");
    }
  }, [status, navigate]);

  return (
    <MainContentWrapper>
      <div className="flex items-center justify-center w-full mt-8">
        <LogoAndDriverInfo
          className="flex flex-col items-center justify-center"
          driverName={profile?.driverName || "—"}
          plateNumber={profile?.plateNumber || "—"}
        />
      </div>

      <div className="flex flex-col items-center justify-center">
        <RippleAvatar photoUrl={profile?.photoUrl} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-white text-center">
          <p className="font-semibold text-[20px] uppercase">AWAITING DRIVER</p>
          <p className="font-semibold text-[20px] uppercase">CONFIRMATION!</p>

          {/* {process.env.NODE_ENV === "development" && (
            <div className="text-xs opacity-60 mt-2 space-y-1">
              <p>WS: {wsConnected ? "🟢 connected" : "🔴 disconnected"} | Status: {status}</p>
              {wsError && <p className="text-red-400">WS error: {wsError}</p>}
              {pollError && <p className="text-yellow-400">Poll: {pollError}</p>}
              <p className="text-gray-400">Phone: {phoneNumber} | Ride: {rideId}</p>
            </div>
          )} */}
        </div>

        <div className="mt-auto">
          <Footer text="Powered by Moto street pickup" />
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default AwaitingDriverConfirm;
