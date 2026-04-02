import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { AnimatedSection } from "./AnimatedSection";

const faqs = [
  {
    question: "How quickly can I find a worker after I post a task?",
    answer:
      "Most tasks receive their first offer within 15–30 minutes, especially during peak hours (mornings and evenings). Tasks with clear descriptions, a fair budget, and photos typically fill fastest — often within minutes.",
  },
  {
    question: "Can I offer both cash and online payment on the same task?",
    answer:
      "Absolutely. When you post a task you can select both payment methods and let the worker choose their preference at offer time. This flexibility usually means you attract more bids.",
  },
  {
    question: "What happens if a worker doesn't show up?",
    answer:
      "If a confirmed worker fails to show without cancelling you can report a no-show directly in the app. Online payments are immediately returned to your escrow hold and you can re-post or hire another worker without re-entering payment details. Repeat no-shows affect the worker's rating and account standing.",
  },
  {
    question: "Is there a minimum task price?",
    answer:
      "There's no platform-enforced minimum, but we recommend a floor of $10 to attract quality workers and cover their travel time. The app will show a suggested price range based on similar tasks in your area.",
  },
  {
    question: "How does the rating system work?",
    answer:
      "After every completed task, both the poster and the worker leave a star rating (1–5) and an optional text review. Ratings are permanent and publicly visible. There are no paid boosts or ways to remove legitimate reviews — authenticity is everything.",
  },
  {
    question: "What if I need to cancel a task I already posted?",
    answer:
      "You can cancel at any time before a worker is confirmed at no charge. Once a worker is confirmed, cancelling within 2 hours of the agreed start time incurs a small cancellation fee (shown at the time of cancellation) to compensate the worker for their time. Online payment holds are automatically refunded minus any applicable fee.",
  },
];

export const HowItWorksFAQ = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Quick answers
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-gray-600">
            Common process questions. For billing, accounts, and more, visit our{" "}
            <Link
              href="/faq"
              className="font-semibold text-blue-600 underline-offset-2 hover:underline"
            >
              full FAQ
            </Link>
            .
          </p>
        </AnimatedSection>

        {/* Accordion */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white px-6 py-2 shadow-lg shadow-gray-200/50">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b border-gray-100 last:border-none"
                >
                  <AccordionTrigger className="py-5 text-left font-semibold text-gray-900 hover:text-blue-600 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-gray-600 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
