const testimonials = [
  {
    quote:
      "I posted a task to assemble a crib at 9pm. By 10:15 someone was at my door, kit in hand. He left, the crib was solid, and I almost cried. New baby, lifesaver.",
    name: "Maya R.",
    location: "Brooklyn, NY",
    role: "Poster",
    initial: "M",
    avatarStyle: { background: "linear-gradient(135deg, #fed7aa, #f97316)" },
  },
  {
    quote:
      "I'm a grad student and doable basically pays my groceries. I pick tasks I'm good at — IKEA assembly, tech setup — and there's almost always something nearby on a free afternoon.",
    name: "Jordan K.",
    location: "Crown Heights, NY",
    role: "Helper",
    initial: "J",
    avatarStyle: { background: "linear-gradient(135deg, #c7d2fe, #6366f1)" },
  },
  {
    quote:
      "I post tasks on Tuesdays and pick up tasks on Saturdays. Same app, same login, no weird mode switching. Built honestly the way I'd want it built.",
    name: "Aiden T.",
    location: "Greenpoint, NY",
    role: "Both",
    initial: "A",
    avatarStyle: { background: "linear-gradient(135deg, #bbf7d0, #10b981)" },
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-ds-bg" id="reviews">
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        {/* Header */}
        <div className="flex justify-between items-end gap-8 flex-wrap mb-12">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-ds-ink-3 mb-3.5">
              Customer feedback
            </div>
            <h2
              className="font-serif font-normal leading-[1.05] tracking-tight text-ds-ink m-0"
              style={{ fontSize: "clamp(34px, 4vw, 52px)", textWrap: "balance" } as React.CSSProperties}
            >
              People are{" "}
              <em className="italic text-ds-orange not-italic">getting things done</em>.
            </h2>
          </div>
          <p className="text-[17px] text-ds-ink-2 m-0" style={{ maxWidth: 480 }}>
            Real reviews from real people. We don&apos;t pay for testimonials — and it shows.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-ds-line rounded-2xl p-8 flex flex-col"
            >
              <div
                className="font-serif italic text-[64px] leading-[0.6] text-ds-orange mb-2"
              >
                &ldquo;
              </div>
              <blockquote
                className="font-serif text-[18px] leading-relaxed text-ds-ink m-0 mb-6 flex-1"
                style={{ letterSpacing: "-0.005em", textWrap: "pretty" } as React.CSSProperties}
              >
                {t.quote}
              </blockquote>
              <div className="flex items-center gap-3 pt-5 border-t border-ds-line">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0"
                  style={t.avatarStyle}
                >
                  {t.initial}
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold text-ds-ink leading-tight">{t.name}</div>
                  <div className="text-[12px] text-ds-ink-3 font-medium mt-0.5">{t.location}</div>
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ds-orange-ink bg-ds-orange-soft px-2.5 py-1.5 rounded-full">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
