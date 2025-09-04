import bgImg from './assets/bg-img.png'; // Correctly import the image
import frame from './assets/Frame.png'; // Do the same for other images
import logo from './assets/logo.svg';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      {/* Driver Information */}
      <div
        className="h-[414px] w-full flex items-center justify-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImg})`,
            marginTop: '-40px',
          }}
        >
          {/* Removed the blur div */}
        </div>
      </div>

      <div
        className="flex flex-col items-center justify-end flex-grow w-full px-4 sm:px-6 md:px-8"
        style={{
          backgroundImage: `url(${frame})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'cover',
          background: 'linear-gradient(180deg, #0F141F 11.44%, rgba(0, 0, 0, 0.00) 157.97%)',
        }}
      >
        <div>
          <img src={logo} alt="Logo" />
        </div>
        <div className="text-white text-center mt-6">
          <p className="text-lg">You're riding with Abebe</p>
          <p className="text-gray-300">-Plate: AB123556</p>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-sm space-y-6 mt-12 px-3">
          <input
            type="text"
            placeholder="Name ______"
            className="w-full p-4 bg-transparent border border-white rounded-lg text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="tel"
            placeholder="Phone ______"
            className="w-full p-4 bg-transparent border border-white rounded-lg text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="relative w-full bg-black py-4 px-4 pr-12 mt-10 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors">
            <span className="block text-center">Start Ride</span>
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-semibold"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="w-full text-center mt-2 mb-2">
          <p className="text-black text-sm mt-2">
            Powered by Moto street pickup
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;