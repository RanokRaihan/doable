import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Post your task",
    description:
      "Tell us what you need done, when you need it, and your budget. It's free to post and takes less than 2 minutes.",
    gradient: "from-blue-500 to-indigo-500",
    iconColor: "text-blue-600", // Added specific text color for the icon
  },
  {
    icon: Users,
    title: "2. Review offers",
    description:
      "Get offers from skilled helpers nearby. Compare their profiles, ratings, and prices to choose the best fit.",
    gradient: "from-purple-500 to-pink-500",
    iconColor: "text-purple-600",
  },
  {
    icon: ShieldCheck,
    title: "3. Get it done",
    description:
      "Your payment is held securely in escrow. Only release the funds once you are 100% satisfied with the work.",
    gradient: "from-emerald-500 to-teal-500",
    iconColor: "text-emerald-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600">
            Getting help shouldn&apos;t be complicated. We&apos;ve streamlined
            the process to be fast, safe, and transparent.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Decorative Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-gray-200 via-blue-200 to-gray-200 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Step Icon */}
              <div className="relative mx-auto w-24 h-24 mb-8">
                {/* Glowing background effect */}
                <div
                  className={`absolute inset-0 rounded-full bg-linear-to-br ${step.gradient} opacity-10 blur-xl group-hover:opacity-30 transition-opacity duration-500`}
                ></div>

                <div className="relative w-full h-full bg-white rounded-full border border-gray-100 shadow-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  {/* FIX: Use standard text color instead of bg-clip-text */}
                  <step.icon
                    size={36}
                    className={step.iconColor}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Step Number Badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm  shadow-sm">
                  {index + 1}
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {step.title.split(". ")[1]}
              </h3>
              <p className="text-gray-600 leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Button size="lg" variant="default" asChild>
            <Link href="/post-task">
              Start your first task
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required to post a task.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
