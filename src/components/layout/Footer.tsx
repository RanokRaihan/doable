import Link from "next/link";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Browse tasks", href: "/tasks" },
      { label: "Categories", href: "/#categories" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Trust & safety", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];

function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 no-underline group">
      <div
        className="w-7 h-7 rounded-lg bg-ds-ink flex items-center justify-center text-ds-bg font-bold text-[22px] leading-none select-none"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <span style={{ transform: "translateY(-1px)", display: "block" }}>•</span>
      </div>
      <span className="text-[20px] font-semibold tracking-[-0.02em] text-ds-ink">
        doable
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer
      className="bg-ds-bg pt-16 pb-10 border-t"
      style={{ borderColor: "#e7e5df" }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        {/* Main grid: brand + 3 link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <LogoMark />
            <p className="text-[14px] text-ds-ink-2 mt-4 leading-relaxed" style={{ maxWidth: 300 }}>
              Small jobs, big help. The neighborhood task platform where everyone wins.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h5 className="text-[12px] font-medium uppercase tracking-[0.14em] text-ds-ink-3 m-0 mb-4">
                {col.heading}
              </h5>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-[14px] font-medium text-ds-ink py-2 no-underline hover:text-ds-orange-ink transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex justify-between items-center flex-wrap gap-4 mt-14 pt-6 border-t text-[13px] font-medium text-ds-ink-3"
          style={{ borderColor: "#e7e5df" }}
        >
          <span>© 2026 doable, inc. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-ds-ink-3 hover:text-ds-ink no-underline transition-colors">Privacy</Link>
            <Link href="/terms" className="text-ds-ink-3 hover:text-ds-ink no-underline transition-colors">Terms</Link>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
