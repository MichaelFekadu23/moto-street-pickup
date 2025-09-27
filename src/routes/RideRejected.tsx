import Footer from "../components/Footer";
import LogoAndDriverInfo from "../components/LogoAndDriverInfo";
import MainContentWrapper from "../components/MianContentWrapper";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react"; // optional: red reject icon
import { useDriver } from "../features/ride/rideContext";

export const RideRejected = () => {
  const navigate = useNavigate();
  const driver = useDriver();
  const token = driver.token;

  return (
    <MainContentWrapper>
      <div className="flex flex-col items-center justify-between w-full max-w-sm flex-1">
        {/* Top logo/driver placeholder */}
        <div className="mt-12">
          <LogoAndDriverInfo
            className="flex flex-col items-center justify-center"
            driverName="—"
            plateNumber="—"
            showDriverInfo={false}
          />
        </div>

        {/* Middle content */}
        <div className="flex flex-col items-center justify-center mt-10 mb-3 gap-10 text-center">
          <XCircle className="mt-4 w-16 h-16 text-red-500 animate-pulse" />
          <p className="text-gray-200 font-semibold text-base uppercase tracking-wide md:text-xl">
            The Driver Rejected Your Request
          </p>
          <button
            onClick={() => navigate(`/?code=${token}`)}
            className="w-full max-w-xs bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-5 rounded-lg font-semibold text-sm shadow-lg hover:from-red-600 hover:to-red-800 transition-all"
          >
            Try Again
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 w-full">
          <Footer text="Powered by Moto street pickup" />
        </div>
      </div>
    </MainContentWrapper>
  );
};
