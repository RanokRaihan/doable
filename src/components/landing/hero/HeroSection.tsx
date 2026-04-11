import Hero3DSlider from "./Hero3DSlider";
import HeroGraphic from "./HeroGraphic";
import HeroLeftSection from "./HeroLeftSection";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32 lg:pt-28 lg:pb-48">
      <HeroGraphic />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <HeroLeftSection />

          <Hero3DSlider />
        </div>
      </div>
    </div>
  );
};

export default Hero;
