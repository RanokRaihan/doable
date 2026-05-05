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
  { label: "You post & set budget", icon: CreditCard },
  { label: "Funds held in escrow", icon: Lock },
  { label: "Worker completes job", icon: Check },
  { label: "You approve & funds release", icon: Wallet },
];

const sharedFeatures = [
  { icon: ShieldCheck, text: "No hidden fees" },
  { icon: RefreshCcw, text: "Flexible & reversible" },
  { icon: Banknote, text: "Transparent pricing" },
];

export const PaymentSection = () => {
  return (
    <section id="payment" className="relative overflow-hidden bg-ds-bg py-24">
      <div className="relative mx-auto px-8" style={{ maxWidth: 1360 }}>
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            Payment Flexibility
          </span>
          <h2
            className="mx-auto mt-4 max-w-2xl font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            Pay or earn exactly{" "}
            <em className="italic text-ds-orange">the way you want</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] text-ds-ink-2">
            Every task supports both online and cash payment. The poster
            chooses, the worker agrees — simple, transparent, and fully
            flexible.
          </p>
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Online payment card */}
          <AnimatedItem direction="left">
            <AnimatedSection direction="left">
              <div
                className="group relative h-full overflow-hidden rounded-3xl border border-ds-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  boxShadow:
                    "0 1px 0 rgba(15,23,42,0.04), 0 4px 16px -4px rgba(15,23,42,0.08)",
                }}
              >
                <div className="relative">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ds-orange-soft transition-transform duration-300 group-hover:scale-110">
                      <CreditCard size={26} className="text-ds-orange-ink" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold text-ds-ink">
                        Online Payment
                      </h3>
                      <p className="text-[13px] text-ds-ink-3">
                        Secure escrow — pay with card or wallet
                      </p>
                    </div>
                  </div>

                  <p className="mb-8 text-[15px] leading-relaxed text-ds-ink-2">
                    Your money is held safely by Doable and only released when
                    you confirm satisfaction. Zero risk, full control.
                  </p>

                  <div className="space-y-3">
                    {onlineSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ds-orange-soft text-ds-orange-ink text-sm font-bold",
                          )}
                        >
                          <step.icon size={16} />
                        </div>
                        <p className="flex-1 text-[13px] font-medium text-ds-ink-2">
                          {step.label}
                        </p>
                        {i < onlineSteps.length - 1 && (
                          <div className="absolute ml-4.5 mt-9 h-3 w-0.5 bg-ds-line" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Visa / Mastercard", "Digital Wallet", "Bank Transfer"].map(
                      (method) => (
                        <span
                          key={method}
                          className="rounded-full border border-ds-line bg-ds-bg px-3 py-1 text-[12px] font-semibold text-ds-ink-2"
                        >
                          {method}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </AnimatedItem>

          {/* Cash payment card */}
          <AnimatedItem direction="right">
            <AnimatedSection direction="right">
              <div
                className="group relative h-full overflow-hidden rounded-3xl border border-ds-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  boxShadow:
                    "0 1px 0 rgba(15,23,42,0.04), 0 4px 16px -4px rgba(15,23,42,0.08)",
                }}
              >
                <div className="relative">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ds-bg-2 transition-transform duration-300 group-hover:scale-110">
                      <HandshakeIcon size={26} className="text-ds-ink-2" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold text-ds-ink">
                        Cash Payment
                      </h3>
                      <p className="text-[13px] text-ds-ink-3">
                        Local trust — pay in person at completion
                      </p>
                    </div>
                  </div>

                  <p className="mb-8 text-[15px] leading-relaxed text-ds-ink-2">
                    Prefer to pay in hand? No problem. Agree on a cash price
                    upfront, meet the worker, and pay once you&apos;re happy.
                    Both sides confirm digitally so it&apos;s all on record.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Set a cash price on the task listing",
                      "Worker bids knowing it's cash-based",
                      "Meet in person, work gets done",
                      "Both confirm completion in the app",
                      "Ratings & record kept on both profiles",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ds-bg-2 text-ds-ink-2">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="text-[14px] text-ds-ink-2">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 rounded-xl border border-ds-line bg-ds-bg px-4 py-3">
                    <p className="text-[12px] font-medium text-ds-ink-2">
                      🤝 Cash tasks are location-filtered — only workers near
                      you will see them.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </AnimatedItem>
        </div>

        <AnimatedSection direction="up" delay={0.15} className="mt-12">
          <div className="flex flex-wrap justify-center gap-6">
            {sharedFeatures.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 rounded-full border border-ds-line bg-white px-5 py-3"
                style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}
              >
                <Icon size={16} className="text-ds-orange" />
                <span className="text-[13px] font-semibold text-ds-ink-2">
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
