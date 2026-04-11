const HeroGraphic = () => {
  return (
    <>
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
    </>
  );
};

export default HeroGraphic;
