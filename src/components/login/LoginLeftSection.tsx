import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LoginLeftSection = () => {
  return (
    <aside className="hidden lg:flex lg:w-[52%] flex-col bg-ds-ink relative overflow-hidden h-full isolate">
      {/* Hairline orange accent strip */}
      <div
        className="absolute left-0 right-0 top-0 h-1 z-10"
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
            <Image src="/logo.png" alt="Doable Logo" width={40} height={40} />
            <span className="text-[20px] font-semibold tracking-tight text-ds-bg leading-none">
              doable
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[13px] font-medium text-white/70 px-3.5 py-2 rounded-full border border-white/18 hover:bg-white/6 hover:text-white transition-colors no-underline"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
        </div>

        {/* Mid content */}
        <div className="flex-1 flex flex-col justify-center py-6 max-w-130 min-h-0">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[#FDBA74] bg-orange-500/[0.14] px-3 py-2 rounded-full w-fit mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange shrink-0" />
            Welcome back
          </div>

          <h1 className="font-serif text-[clamp(34px,3.4vw,50px)] leading-[1.05] tracking-[-0.02em] text-ds-bg mb-4">
            Pick up{" "}
            <em className="italic text-[#FDBA74] font-normal">right where</em>{" "}
            you left off.
          </h1>

          <p className="text-[15px] text-white/70 mb-7 max-w-115">
            Three new tasks matched your skills since you last checked in. Two
            posters are waiting on your reply.
          </p>

          {/* Ticket cards */}
          <div className="space-y-2.5 max-w-115">
            <div className="flex items-center gap-3.5 bg-white/5 border border-white/[0.14] border-l-[3px] border-l-ds-orange rounded-lg px-4 py-3">
              <div className="font-serif italic text-[26px] leading-none text-[#FDBA74] w-14 shrink-0">
                01
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-ds-bg leading-snug tracking-[-0.005em]">
                  Help carry a sofa up to a 3rd-floor walkup
                </div>
                <div className="text-[11px] font-medium font-mono text-white/50 mt-1 uppercase tracking-[0.08em]">
                  Park Slope · 0.4 mi · today
                </div>
              </div>
              <div className="text-[14px] font-semibold px-2.5 py-1.5 rounded bg-emerald-500/16 text-emerald-300 whitespace-nowrap shrink-0">
                $60
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/5 border border-white/[0.14] border-l-[3px] border-l-ds-orange rounded-lg px-4 py-3">
              <div className="font-serif italic text-[26px] leading-none text-[#FDBA74] w-14 shrink-0">
                02
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-ds-bg leading-snug tracking-[-0.005em]">
                  Midday walk for Bagel — friendly cocker
                </div>
                <div className="text-[11px] font-medium font-mono text-white/50 mt-1 uppercase tracking-[0.08em]">
                  Cobble Hill · 0.8 mi · 1pm
                </div>
              </div>
              <div className="text-[14px] font-semibold px-2.5 py-1.5 rounded bg-emerald-500/16 text-emerald-300 whitespace-nowrap shrink-0">
                $25
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/5 border border-white/30 border-l-[3px] border-l-white/30 rounded-lg px-4 py-3">
              <div className="font-serif italic text-[26px] leading-none text-white/55 w-14 shrink-0">
                03
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-ds-bg leading-snug tracking-[-0.005em]">
                  Algebra II tutor — Tuesdays
                </div>
                <div className="text-[11px] font-medium font-mono text-white/50 mt-1 uppercase tracking-[0.08em]">
                  Williamsburg · weekly · saved
                </div>
              </div>
              <div className="text-[14px] font-semibold px-2.5 py-1.5 rounded bg-white/8 text-ds-bg whitespace-nowrap shrink-0">
                ★ saved
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stat row */}
        <div className="flex items-center justify-between gap-6 pt-5 border-t border-white/12">
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
          <div className="text-[11px] font-medium font-mono text-white/40 px-2.5 py-1.5 rounded border border-dashed border-white/18 hidden xl:block">
            v3.2 · local
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LoginLeftSection;
