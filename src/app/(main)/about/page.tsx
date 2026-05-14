import { AboutCTA } from "@/components/about/AboutCTA";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutValues } from "@/components/about/AboutValues";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Doable is a community-powered task marketplace where anyone can post jobs and pick up work. Learn about our mission, values, story, and the people behind the platform.",
  openGraph: {
    title: "About Doable",
    description:
      "Learn about our mission, values, and the community-powered marketplace connecting task posters with skilled helpers.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About Doable" }],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <AboutMission />
      <AboutStats />
      <AboutValues />
      <AboutStory />
      <AboutCTA />
    </main>
  );
}
