import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const RegisterLeftSection = () => {
  return (
    <aside className="hidden lg:flex lg:w-[52%] flex-col bg-ds-ink relative overflow-hidden h-full isolate">
      {/* Hairline orange accent strip */}
      <div
        className="absolute left-0 right-0 top-0 h-[4px] z-10"
        style={{
          background:
            "linear-gradient(90deg, #F97316 0 28%, transparent 28% 32%, rgba(250,250,247,0.18) 32% 100%)",
        }}
      />
      {/* Subtle dot field */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(250,250,247,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "linear-gradient(180deg, transparent, #000 10%, #000 90%, transparent)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-8 xl:p-12">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span className="w-7 h-7 rounded-lg bg-ds-bg text-ds-ink grid place-items-center text-[22px] leading-none font-bold flex-shrink-0">
              •
            </span>
            <span className="text-[20px] font-semibold tracking-tight text-ds-bg leading-none">
              doable
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[13px] font-medium text-white/70 px-3.5 py-2 rounded-full border border-white/[0.18] hover:bg-white/[0.06] hover:text-white transition-colors no-underline"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
        </div>

        {/* Mid content */}
        <div className="flex-1 flex flex-col justify-center py-6 max-w-[520px] min-h-0">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[#FDBA74] bg-orange-500/[0.14] px-3 py-2 rounded-full w-fit mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange flex-shrink-0" />
            Join doable
          </div>

          <h1 className="font-serif text-[clamp(34px,3.4vw,50px)] leading-[1.05] tracking-[-0.02em] text-ds-bg mb-4">
            Small jobs,{" "}
            <em className="italic text-[#FDBA74] font-normal">
              big help
            </em>
            . Right around the corner.
          </h1>

          <p className="text-[15px] text-white/70 mb-7 max-w-[460px]">
            Post a task in 60 seconds, or pick up small jobs nearby on your own
            schedule. One account does both.
          </p>

          {/* Ticket cards */}
          <div className="space-y-2.5 max-w-[460px]">
            <div className="flex items-center gap-3.5 bg-white/[0.05] border border-white/[0.14] border-l-[3px] border-l-ds-orange rounded-[4px] px-4 py-3">
              <div className="font-serif italic text-[26px] leading-none text-[#FDBA74] w-14 flex-shrink-0">
                01
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-ds-bg leading-snug tracking-[-0.005em]">
                  Post a task in 60 seconds
                </div>
                <div className="text-[11px] font-medium font-mono text-white/50 mt-1 uppercase tracking-[0.08em]">
                  Free to post · matches in ~14 min
                </div>
              </div>
              <div className="text-[14px] font-semibold px-2.5 py-1.5 rounded bg-emerald-500/[0.16] text-emerald-300 whitespace-nowrap flex-shrink-0">
                free
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/[0.05] border border-white/[0.14] border-l-[3px] border-l-ds-orange rounded-[4px] px-4 py-3">
              <div className="font-serif italic text-[26px] leading-none text-[#FDBA74] w-14 flex-shrink-0">
                02
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-ds-bg leading-snug tracking-[-0.005em]">
                  Earn on your own schedule
                </div>
                <div className="text-[11px] font-medium font-mono text-white/50 mt-1 uppercase tracking-[0.08em]">
                  $0 helper fee · payouts &lt; 5 min
                </div>
              </div>
              <div className="text-[14px] font-semibold px-2.5 py-1.5 rounded bg-emerald-500/[0.16] text-emerald-300 whitespace-nowrap flex-shrink-0">
                $0 fee
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/[0.05] border border-white/30 border-l-[3px] border-l-white/30 rounded-[4px] px-4 py-3">
              <div className="font-serif italic text-[26px] leading-none text-white/55 w-14 flex-shrink-0">
                03
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-ds-bg leading-snug tracking-[-0.005em]">
                  Vetted, reviewed, neighborly
                </div>
                <div className="text-[11px] font-medium font-mono text-white/50 mt-1 uppercase tracking-[0.08em]">
                  4.9★ avg · escrow protected
                </div>
              </div>
              <div className="text-[14px] font-semibold px-2.5 py-1.5 rounded bg-white/[0.08] text-ds-bg whitespace-nowrap flex-shrink-0">
                ★ 4.9
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stat row */}
        <div className="flex items-center justify-between gap-6 pt-5 border-t border-white/[0.12]">
          <div className="flex gap-7">
            <div>
              <div className="font-serif italic text-[24px] leading-none text-[#FDBA74]">
                12,400+
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/55 mt-1.5">
                tasks this week
              </div>
            </div>
            <div>
              <div className="font-serif italic text-[24px] leading-none text-[#FDBA74]">
                4.9★
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/55 mt-1.5">
                avg. rating
              </div>
            </div>
            <div>
              <div className="font-serif italic text-[24px] leading-none text-[#FDBA74]">
                &lt;5m
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/55 mt-1.5">
                payout time
              </div>
            </div>
          </div>
          <div className="text-[11px] font-medium font-mono text-white/40 px-2.5 py-1.5 rounded border border-dashed border-white/[0.18] hidden xl:block">
            v3.2 · local
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RegisterLeftSection;
