import bgImg from '../assets/bg-image.png';

const Header = () => {
  return (
    <div className="relative flex-[0.55] w-full overflow-hidden">
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