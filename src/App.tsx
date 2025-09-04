import bgImg from './assets/bg-img.png'; 
import frame from './assets/Frame.png'; 
import logo from './assets/logo.svg';

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Background */}
      <div className="relative flex-[0.4] md:flex-[0.45] lg:flex-[0.5] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center md:blur-lg"
          style={{
            backgroundImage: `url(${bgImg})`,
            marginTop: '-40px',
          }}
        />
      </div>

      {/* Main Content */}
      <div
        className="relative flex-[0.6] md:flex-[0.55] lg:flex-[0.5] flex flex-col items-center justify-between px-4 sm:px-6 md:px-8"
        style={{
          backgroundImage: `url(${frame})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'cover',
          background: 'linear-gradient(180deg, #0F141F 11.44%, rgba(0, 0, 0, 0.00) 157.97%)',
        }}
      >
        {/* Logo & Info */}
        <div className="flex flex-col items-center mt-3">
          <img src={logo} alt="Logo" className="h-10 sm:h-12" />
          <div className="text-white text-center mt-4">
            <p className="text-lg sm:text-xl">You're riding with Abebe</p>
            <p className="text-gray-300">-Plate: AB123556</p>
          </div>
        </div>

        {/* Form */}
        <div className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Name ______"
            className="w-full p-3 bg-transparent border border-white rounded-lg text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="tel"
            placeholder="Phone ______"
            className="w-full p-3 bg-transparent border border-white rounded-lg text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="relative w-full bg-black py-3 px-4 pr-12 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors">
            <span className="block text-center">Start Ride</span>
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>

        {/* Footer */}
        <footer className="w-full text-center mb-2">
          <p className="text-black text-xs sm:text-sm">Powered by Moto street pickup</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
