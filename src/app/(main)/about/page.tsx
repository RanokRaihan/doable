import { AboutCTA } from "@/components/about/AboutCTA";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutValues } from "@/components/about/AboutValues";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Doable",
  description:
    "Doable is a community-powered task marketplace where everyone can post jobs and pick up work. Learn about our mission, values, story, and the numbers behind the platform.",
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
