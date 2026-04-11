import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
type CategoryProps = {
  label: string;
  icon: React.ElementType;
  bg: string;
  color: string;
  count: string;
};
const CategoryCard = ({ cat }: { cat: CategoryProps }) => {
  return (
    <Link href={`/tasks?category=${cat.label}`} className="block h-full">
      <Card className="h-full hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group border-gray-100">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
          <div
            className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
          >
            <cat.icon size={24} />
          </div>
          <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
            {cat.label}
          </h3>
          <p className="text-xs text-muted-foreground">{cat.count}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
