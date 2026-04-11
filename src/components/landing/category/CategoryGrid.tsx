import { Code, Home, Move, Smartphone, Truck, Wrench } from "lucide-react";
import CategoryCard from "./CategoryCard";

const categories = [
  {
    icon: Home,
    label: "Home Cleaning",
    count: "120+ tasks",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Move,
    label: "Moving & Lifting",
    count: "85+ tasks",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Wrench,
    label: "Repairs",
    count: "200+ tasks",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Code,
    label: "Web Development",
    count: "45+ tasks",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Smartphone,
    label: "Tech Support",
    count: "30+ tasks",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Truck,
    label: "Delivery",
    count: "90+ tasks",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.label} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
