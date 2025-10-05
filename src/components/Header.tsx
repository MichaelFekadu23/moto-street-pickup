import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import bgImg from '../assets/bgSvg.svg';
import { useLanguage } from '../features/ride/rideContext';

const Header = () => {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { i18n } = useTranslation();
  const isEntry = location.pathname === '/';

  const handleLanguageChange = (newLang: 'en' | 'am') => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="relative w-full h-[44.44%] sm:h-[53%] overflow-hidden z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          zIndex: 10,
          backgroundImage: `linear-gradient(to bottom, rgba(16, 20, 28, 0.9) 0%, rgba(16, 20, 28, 0) 58%, rgba(16, 20, 28, 0.9) 100%), url(${bgImg})`,
          backgroundColor: '#10141C',
        }}
      >
        {isEntry && (
          <div className="absolute top-4 right-4 z-20">
            <select
              className="bg-black text-white text-sm rounded-full px-4 py-2 pr-8 outline-none appearance-none"
              style={{
                backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOCAxMS4yOTdsLTQuNjQ3LTQuNjQ3LjcwNy0uNzA3TDggOS43ODlsMy45NDEtMy45NDIuNzA3LjcwNy00LjY0NyA0LjY0N3oiIGZpbGw9IiNmZmYiLz48L3N2Zz4=)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: language === 'en' ? 'right 0.7rem center' : 'right 0.5rem center',
                backgroundSize: '1rem',
              }}
              value={language}
              onChange={(e) => {
                handleLanguageChange(e.target.value as 'en' | 'am');
              }}
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;