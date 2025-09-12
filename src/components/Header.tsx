import bgImg from '../assets/bg-image.png';

const Header = () => {
  // A placeholder image URL is used since the original image asset is not available.
  // const placeholderImageUrl = "https://placehold.co/1920x1080/0d0d0d/e5e7eb?text=Header+Image";
  
  return (
    <div className="relative w-full h-90 sm:h-96 overflow-hidden z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImg})`,
        }}
      />
    </div>
  );
};


export default Header;