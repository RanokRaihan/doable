import Link from "next/link";

export default function CTAStrip() {
  return (
    <section className="pb-24 bg-ds-bg" style={{ paddingTop: 0 }}>
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        <div
          className="rounded-3xl px-7 py-10 md:px-16 md:py-16 flex justify-between items-center gap-8 flex-wrap"
          style={{ background: "#0f172a", color: "#fafaf7" }}
        >
          <h3
            className="font-serif font-normal leading-[1.1] tracking-tight m-0"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", color: "#fafaf7", maxWidth: 600 }}
          >
            Got 30 minutes?{" "}
            <em className="italic not-italic" style={{ color: "#fdba74" }}>Make some cash.</em>
            <br />
            Got a thing?{" "}
            <em className="italic not-italic" style={{ color: "#fdba74" }}>Get it done.</em>
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 h-[46px] px-5 rounded-full text-[15px] font-medium text-ds-ink no-underline transition-all hover:-translate-y-px"
              style={{ background: "#fafaf7" }}
            >
              Create your account
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 h-[46px] px-5 rounded-full text-[15px] font-medium border no-underline transition-all hover:-translate-y-px"
              style={{
                background: "transparent",
                color: "#fafaf7",
                borderColor: "rgba(250,250,247,0.3)",
              }}
            >
              How it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
