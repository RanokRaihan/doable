import { cn } from "@/lib/utils";
import {
  Banknote,
  Check,
  CreditCard,
  HandshakeIcon,
  Lock,
  RefreshCcw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { AnimatedItem, AnimatedSection } from "./AnimatedSection";

const onlineSteps = [
  {
    label: "You post & set budget",
    icon: CreditCard,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "Funds held in escrow",
    icon: Lock,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "Worker completes job",
    icon: Check,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "You approve & funds release",
    icon: Wallet,
    color: "text-purple-600 bg-purple-50",
  },
];

const sharedFeatures = [
  { icon: ShieldCheck, text: "No hidden fees" },
  { icon: RefreshCcw, text: "Flexible & reversible" },
  { icon: Banknote, text: "Transparent pricing" },
];

export const PaymentSection = () => {
  return (
    <section id="payment" className="relative overflow-hidden bg-white py-24">
      {/* Background blobs */}
      <div className="absolute left-0 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400 opacity-5 blur-[120px]" />
      <div className="absolute right-0 top-1/2 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400 opacity-5 blur-[120px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-600">
            Payment Flexibility
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pay or earn exactly{" "}
            <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              the way you want
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Every task supports both online and cash payment. The poster
            chooses, the worker agrees — simple, transparent, and fully
            flexible.
          </p>
        </AnimatedSection>

        {/* Two payment cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Online payment card */}
          <AnimatedItem direction="left">
            <AnimatedSection direction="left">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-purple-100 bg-white p-8 shadow-xl shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/15">
                {/* Glow overlay */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-purple-50/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  {/* Card header */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 shadow-md shadow-purple-500/20 transition-transform duration-300 group-hover:scale-110">
                      <CreditCard size={26} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Online Payment
                      </h3>
                      <p className="text-sm text-gray-500">
                        Secure escrow — pay with card or wallet
                      </p>
                    </div>
                  </div>

                  <p className="mb-8 text-gray-600 leading-relaxed">
                    Your money is held safely by GetItDone and only released
                    when you confirm satisfaction. Zero risk, full control.
                  </p>

                  {/* Escrow flow steps */}
                  <div className="space-y-3">
                    {onlineSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                            step.color,
                          )}
                        >
                          <step.icon size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            {step.label}
                          </p>
                        </div>
                        {i < onlineSteps.length - 1 && (
                          <div className="absolute ml-4.5 mt-9 h-3 w-0.5 bg-purple-100" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Supported methods */}
                  <div className="mt-8 flex flex-wrap gap-2">
                    {[
                      "Visa / Mastercard",
                      "Digital Wallet",
                      "Bank Transfer",
                    ].map((method) => (
                      <span
                        key={method}
                        className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </AnimatedItem>

          {/* Cash payment card */}
          <AnimatedItem direction="right">
            <AnimatedSection direction="right">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/15">
                {/* Glow overlay */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-50/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  {/* Card header */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 shadow-md shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                      <HandshakeIcon size={26} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Cash Payment
                      </h3>
                      <p className="text-sm text-gray-500">
                        Local trust — pay in person at completion
                      </p>
                    </div>
                  </div>

                  <p className="mb-8 text-gray-600 leading-relaxed">
                    Prefer to pay in hand? No problem. Agree on a cash price
                    upfront, meet the worker, and pay once you&apos;re happy.
                    Both sides confirm digitally so it&apos;s all on record.
                  </p>

                  {/* How it works list */}
                  <ul className="space-y-4">
                    {[
                      "Set a cash price on the task listing",
                      "Worker bids knowing it's cash-based",
                      "Meet in person, work gets done",
                      "Both confirm completion in the app",
                      "Ratings & record kept on both profiles",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="text-sm text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Trust note */}
                  <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-medium text-emerald-700">
                      🤝 Cash tasks are location-filtered — only workers near
                      you will see them.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </AnimatedItem>
        </div>

        {/* Shared features strip */}
        <AnimatedSection direction="up" delay={0.15} className="mt-12">
          <div className="flex flex-wrap justify-center gap-6">
            {sharedFeatures.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm shadow-gray-200/50"
              >
                <Icon size={16} className="text-purple-500" />
                <span className="text-sm font-semibold text-gray-700">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
