import {
  AlertTriangle,
  Boxes,
  Dog,
  Flower2,
  GraduationCap,
  Laptop,
  LayoutGrid,
  Move,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import CategoryCard from "./CategoryCard";

const categories = [
  {
    value: "DELIVERY",
    label: "Delivery",
    icon: Truck,
    count: "90+ tasks",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    value: "CLEANING",
    label: "Cleaning",
    icon: Sparkles,
    count: "120+ tasks",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    value: "REPAIR",
    label: "Repair",
    icon: Wrench,
    count: "200+ tasks",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    value: "TUTORING",
    label: "Tutoring",
    icon: GraduationCap,
    count: "45+ tasks",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    value: "GARDENING",
    label: "Gardening",
    icon: Flower2,
    count: "60+ tasks",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    value: "MOVING",
    label: "Moving",
    icon: Move,
    count: "85+ tasks",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    value: "PET_CARE",
    label: "Pet Care",
    icon: Dog,
    count: "35+ tasks",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    value: "TECH_SUPPORT",
    label: "Tech Support",
    icon: Laptop,
    count: "30+ tasks",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    value: "OTHER",
    label: "Other",
    icon: Boxes,
    count: "50+ tasks",
    color: "text-gray-500",
    bg: "bg-gray-100",
  },
  {
    value: "",
    label: "Browse All",
    icon: LayoutGrid,
    count: "See all tasks",
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  {
    value: "",
    label: "Urgent",
    icon: AlertTriangle,
    count: "Act fast",
    color: "text-red-500",
    bg: "bg-red-50",
    href: "/tasks?priority=URGENT",
  },
  {
    value: "",
    label: "New Listings",
    icon: Star,
    count: "Just posted",
    color: "text-amber-500",
    bg: "bg-amber-50",
    href: "/tasks?sortBy=createdAt&sortOrder=desc",
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Popular Categories
          </h2>
          <p className="text-muted-foreground mt-2">
            Find help with almost anything.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.label} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
