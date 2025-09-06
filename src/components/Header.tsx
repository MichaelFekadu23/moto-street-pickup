import bgImg from '../assets/bg-img.png';

const Header = () => {
  return (
    <div className="relative flex-[0.3] md:flex-[0.35] lg:flex-[0.4] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-contain bg-repeat"
        style={{
          backgroundImage: `url(${bgImg})`,
          marginTop: '-40px',
        }}
      />
    </div>
  );
};

export default Header;