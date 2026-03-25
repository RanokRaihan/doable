import { HowItWorksCTA } from "@/components/howItWorks/HowItWorksCTA";
import { HowItWorksFAQ } from "@/components/howItWorks/HowItWorksFAQ";
import { HowItWorksHero } from "@/components/howItWorks/HowItWorksHero";
import { PaymentSection } from "@/components/howItWorks/PaymentSection";
import { PosterWorkflow } from "@/components/howItWorks/PosterWorkflow";
import { TrustSafety } from "@/components/howItWorks/TrustSafety";
import { WorkerWorkflow } from "@/components/howItWorks/WorkerWorkflow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | GetItDone",
  description:
    "Learn how GetItDone works for both job posters and workers. Post a task in minutes, receive offers, pay with cash or online — and earn money on your own schedule.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <HowItWorksHero />
      <PosterWorkflow />
      <WorkerWorkflow />
      <PaymentSection />
      <TrustSafety />
      <HowItWorksFAQ />
      <HowItWorksCTA />
    </main>
  );
}
