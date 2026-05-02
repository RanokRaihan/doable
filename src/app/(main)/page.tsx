import BecomeHelper from "@/components/landing/becomeHelper/BecomeHelper";
import CategoryGrid from "@/components/landing/category/CategoryGrid";
import FAQ from "@/components/landing/FAQ/FAQ";
import Hero from "@/components/landing/hero/HeroSection";
import HowItWorks from "@/components/landing/howItWorks/HowItWorks";
import LiveFeed from "@/components/landing/liveFeed/LiveFeed";
import Testimonials from "@/components/landing/testimonial/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <LiveFeed />
      <CategoryGrid />
      <Testimonials />
      <FAQ />
      <BecomeHelper />
    </main>
  );
}
