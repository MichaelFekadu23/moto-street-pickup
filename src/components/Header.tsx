import bgImg from '../assets/bgSvg.svg';

const Header = () => {
  return (
    <div className="relative w-full h-[44.44%] overflow-hidden z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          zIndex: 10,
          backgroundImage: `linear-gradient(to bottom, rgba(16, 20, 28, 0.9) 0%, rgba(16, 20, 28, 0) 62%, rgba(16, 20, 28, 0.9) 100%), url(${bgImg})`,
          backgroundColor: '#10141C',
        }}
      />
    </div>
  );
};

export default Header;
