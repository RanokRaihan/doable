import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HeroSearchSection from "./HeroSearchSection";

const HeroLeftSection = () => {
  return (
    <div className="text-center lg:text-left">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-blue-800 to-purple-900 mb-6 leading-tight pb-2">
        Need a hand? <br />
        <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
          We got you.
        </span>
      </h1>

      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
        Connect with skilled helpers in your neighborhood instantly. From home
        repairs to web development, we make it safe, fast, and easy.
      </p>

      <HeroSearchSection />

      {/* Colorful Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
        <Link
          href="/post-task"
          className="px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          Post a Task for Free
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link
          href="/register"
          className="px-8 py-4 rounded-xl bg-white border-2 border-blue-100 text-blue-700 font-bold shadow-sm hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-0.5 transition-all"
        >
          Become a Helper
        </Link>
      </div>
    </div>
  );
};

export default HeroLeftSection;
