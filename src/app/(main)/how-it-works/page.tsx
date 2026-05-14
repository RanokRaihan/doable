import { HowItWorksCTA } from "@/components/howItWorks/HowItWorksCTA";
import { HowItWorksFAQ } from "@/components/howItWorks/HowItWorksFAQ";
import { HowItWorksHero } from "@/components/howItWorks/HowItWorksHero";
import { PaymentSection } from "@/components/howItWorks/PaymentSection";
import { PosterWorkflow } from "@/components/howItWorks/PosterWorkflow";
import { TrustSafety } from "@/components/howItWorks/TrustSafety";
import { WorkerWorkflow } from "@/components/howItWorks/WorkerWorkflow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how Doable works for both task posters and helpers. Post a task in minutes, receive offers, pay with cash or online — and earn money on your own schedule.",
  openGraph: {
    title: "How Doable Works",
    description:
      "Post a task in minutes, receive offers, and pay securely. Or sign up as a helper and earn money on your schedule.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "How Doable Works" }],
  },
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
