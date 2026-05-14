import type { Metadata } from "next";
import CTAStrip from "@/components/landing/cta/CTAStrip";
import Categories from "@/components/landing/categories/Categories";
import FAQ from "@/components/landing/FAQ/FAQ";
import HeroSlider from "@/components/landing/hero/HeroSlider";
import HowItWorks from "@/components/landing/howItWorks/HowItWorks";
import RecentTasks from "@/components/landing/recentTasks/RecentTasks";
import Testimonials from "@/components/landing/testimonials/Testimonials";

export const metadata: Metadata = {
  title: "Doable — Find Help, Get Things Done",
  description:
    "Post any task and get it done by a trusted local helper. Delivery, cleaning, repairs, tutoring, moving and more. Join Doable and get started for free.",
  openGraph: {
    title: "Doable — Find Help, Get Things Done",
    description:
      "Post any task and get it done by a trusted local helper. Delivery, cleaning, repairs, tutoring, moving and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Doable — Task Marketplace",
      },
    ],
  },
};

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
