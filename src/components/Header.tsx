import bgImg from '../assets/bgSvg.svg';

const Header = () => {
  return (
    <div className="relative w-full h-70 sm:h-90 md:h-96 overflow-hidden z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})`, backgroundColor: '#10141C' }}
      />
    </div>
  );
};

export default Header;
