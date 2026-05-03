import Link from "next/link";
import { Truck, Home, Wrench, BookOpen, Leaf, PawPrint } from "lucide-react";

const categories = [
  { icon: Truck, label: "Delivery", count: "2,140 tasks this week", slug: "DELIVERY" },
  { icon: Home, label: "Cleaning", count: "1,820 tasks this week", slug: "CLEANING" },
  { icon: Wrench, label: "Repair", count: "1,460 tasks this week", slug: "REPAIR" },
  { icon: BookOpen, label: "Tutoring", count: "1,180 tasks this week", slug: "TUTORING" },
  { icon: Leaf, label: "Gardening", count: "940 tasks this week", slug: "GARDENING" },
  { icon: PawPrint, label: "Pet care", count: "820 tasks this week", slug: "PET_CARE" },
];

export default function Categories() {
  return (
    <section className="py-24 bg-ds-bg" id="categories">
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        {/* Header */}
        <div className="flex justify-between items-end gap-8 flex-wrap mb-12">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-ds-ink-3 mb-3.5">
              Popular categories
            </div>
            <h2
              className="font-serif font-normal leading-[1.05] tracking-tight text-ds-ink m-0"
              style={{ fontSize: "clamp(34px, 4vw, 52px)", textWrap: "balance" } as React.CSSProperties}
            >
              What people get <em className="italic text-ds-orange not-italic">doable</em>.
            </h2>
          </div>
          <p className="text-[17px] text-ds-ink-2 m-0" style={{ maxWidth: 480 }}>
            From quick favors to weekly help — these are the categories filling up fastest in your area this week.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(({ icon: Icon, label, count, slug }) => (
            <Link
              key={slug}
              href={`/tasks?category=${slug}`}
              className="bg-white border border-ds-line rounded-2xl px-7 py-7 flex items-center gap-5 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:border-ds-ink no-underline group"
            >
              <div
                className="w-14 h-14 rounded-2xl bg-ds-orange-soft text-ds-orange-ink flex items-center justify-center flex-shrink-0"
              >
                <Icon size={28} strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-ds-ink m-0 mb-1 tracking-tight group-hover:text-ds-orange transition-colors">
                  {label}
                </h4>
                <p className="text-[13px] text-ds-ink-3 font-medium m-0">{count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
