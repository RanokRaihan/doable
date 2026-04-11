import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Briefcase, User } from "lucide-react";
import Link from "next/link";

const posterFaqs = [
  {
    question: "Is my payment secure?",
    answer:
      "Yes. We use a secure Escrow system. Your money is held safely by GetItDone and is only released to the helper once you confirm the task is completed to your satisfaction.",
  },
  {
    question: "What if I'm not happy with the work?",
    answer:
      "You are in control. Do not release the payment if the work isn't done right. Request revisions directly, or contact our Dispute Resolution team for a refund.",
  },
  {
    question: "Does it cost money to post a task?",
    answer:
      "No, posting a task is 100% free. You only pay the agreed amount when you hire someone.",
  },
  {
    question: "How do I pick the right helper?",
    answer:
      "Review their profile! You can see their completion rate, star rating, and detailed text reviews from previous clients before you accept their offer.",
  },
];

const helperFaqs = [
  {
    question: "When do I get paid?",
    answer:
      "Instantly. As soon as the Task Poster marks the job as 'Complete', the funds are released from escrow directly to your Wallet. You can withdraw to your bank anytime.",
  },
  {
    question: "Are there fees for helpers?",
    answer:
      "We only make money when you do. Joining is free. We deduct a standard 15% service fee from the total task price to cover platform maintenance, insurance, and support.",
  },
  {
    question: "Do I need to be a professional?",
    answer:
      "Not necessarily! We have tasks for everyone—from moving boxes to expert plumbing. You just need to verify your identity to start.",
  },
  {
    question: "Do I need to be verified?",
    answer:
      "To become a 'Super Helper' and access high-value tasks, yes. You'll need to submit ID verification. For standard tasks, you can start immediately after building your profile.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about getting things done (or doing
            them).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* COLUMN 1: FOR POSTERS */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  For Task Posters
                </h3>
                <p className="text-sm text-gray-500">People hiring help</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-2">
              <Accordion type="single" collapsible className="w-full">
                {posterFaqs.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`poster-${index}`}
                    className="border-b-gray-100 last:border-none"
                  >
                    <AccordionTrigger className="text-left text-gray-900 font-semibold hover:text-blue-600 hover:no-underline py-5">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-5">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* COLUMN 2: FOR HELPERS */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg text-green-600">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">For Taskers</h3>
                <p className="text-sm text-gray-500">People earning money</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-2">
              <Accordion type="single" collapsible className="w-full">
                {helperFaqs.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`helper-${index}`}
                    className="border-b-gray-100 last:border-none"
                  >
                    <AccordionTrigger className="text-left text-gray-900 font-semibold hover:text-green-600 hover:no-underline py-5">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-5">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-16">
          <p className="text-gray-600">
            Still have questions?{" "}
            <Link
              href="/contact"
              className="text-blue-600 font-semibold hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
