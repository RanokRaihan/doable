import CTAStrip from "@/components/landing/cta/CTAStrip";
import Categories from "@/components/landing/categories/Categories";
import FAQ from "@/components/landing/faq/FAQ";
import HeroSlider from "@/components/landing/hero/HeroSlider";
import HowItWorks from "@/components/landing/howItWorks/HowItWorks";
import RecentTasks from "@/components/landing/recentTasks/RecentTasks";
import Testimonials from "@/components/landing/testimonials/Testimonials";

export default function Home() {
  return (
    <main className="bg-ds-bg">
      <HeroSlider />
      <HowItWorks />
      <RecentTasks />
      <Categories />
      <Testimonials />
      <FAQ />
      <CTAStrip />
    </main>
  );
}
