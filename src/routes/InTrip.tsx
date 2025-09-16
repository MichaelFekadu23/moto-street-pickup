import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import MainContentWrapper from "../components/MianContentWrapper";
import PrimaryButton from "../components/PrimaryButton";
import logo from "../assets/logo.svg";
import Footer from "../components/Footer";
import { useRider } from "../features/rider/riderContext";
import { useDriver } from "../features/driver/DriverContext";
import { useRideSessionPolling } from "../features/rideStatus/useRideSessoinPolling";

function readLS(k: string) {
  try {
    const v = localStorage.getItem(k);
    return v && v !== "null" && v !== "undefined" ? v : "";
  } catch {
    return "";
  }
}

const InTrip = () => {
  const navigate = useNavigate();
  const { rider } = useRider();
  const { profile: driver } = useDriver();

  const riderName = rider?.name || readLS("moto_name") || "—";
  const plate = driver?.plateNumber || "—";

  // get rideId saved after initiate
  const rideId = localStorage.getItem("moto_rideId") || "";
  const { status } = useRideSessionPolling({ rideId, intervalMs: 2000 });

  console.log("STATUS", status);
  const isTripCompleted = status === "trip_completed";

  const handleCompleteRide = () => {
    if (!isTripCompleted) return; // guard (button will be disabled anyway)
    navigate("/receipt");
  };

  return (
    <MainContentWrapper>
      {/* Logo + Heading */}
      <motion.div
        className="flex flex-col gap-4 items-center justify-center w-full mt-10"
        aria-live="polite"
        animate={{ scale: [1, 1.02, 1], opacity: [1, 0.95, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={logo} alt="Logo" className="w-[120px] h-[27.72px] md:w-[180px] md:h-[41.58px]" />

        {/* Shimmering text */}
        <motion.p
          className="font-semibold text-[24px] uppercase text-center 
                     bg-clip-text text-transparent 
                     bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(255,255,255,0.55),rgba(255,255,255,0.95))]
                     bg-[length:200%_100%]"
          animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          Ride in <br />progress
        </motion.p>

        {/* Micro progress underline */}
        <div className="mt-1 h-0.5 w-40 overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full w-1/3 bg-white/70"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Trip summary */}
      <div className="border border-white/50 p-4 rounded-md w-full max-w-sm mx-auto">
        <div className="flex justify-between mb-4">
          <span className="text-white font-normal text-[16px]">Rider Name :</span>
          <span className="text-white">{riderName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white font-normal text-[16px]">Number Plate :</span>
          <span className="text-white">{plate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center gap-3 flex-shrink-0">
        <PrimaryButton
          title={isTripCompleted ? "Confirm End Trip" : "Waiting for Driver to End…"}
          onclick={handleCompleteRide}
          disabled={!isTripCompleted}
        />
        <Footer text="Powered by Moto street pickup" />
      </div>
    </MainContentWrapper>
  );
};

export default InTrip;
