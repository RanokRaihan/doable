import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import LiveFeedTaskCard from "./LiveFeedTaskCard";

const MOCK_TASKS = [
  {
    id: "cmj0tjgji000d2g1ut8cwiaqu",
    title: "Assemble and Install a Wooden Bookshelf",
    category: "REPAIR",
    priority: "HIGH",
    status: "PAYMENT_PROCESSING",
    location: "456 Pine Avenue, Springfield, IL",
    baseCompensation: "60",
    scheduledAt: "2025-09-18T10:00:00.000Z",
    createdAt: "2025-12-11T02:28:11.262Z",
  },
  {
    id: "cmjnfqzxq00012gf7k7wmc5ux",
    title: "Lawn Mowing and Hedge Trimming",
    category: "GARDENING",
    priority: "MEDIUM",
    status: "COMPLETED",
    location: "890 Maple Drive, Austin, TX",
    baseCompensation: "85",
    scheduledAt: "2025-09-20T09:00:00.000Z",
    createdAt: "2025-12-26T22:20:50.414Z",
  },
  {
    id: "cmk0nz1zc00012gbxzllqhv20",
    title: "Assemble IKEA Wardrobe and Queen Bed",
    category: "MOVING",
    priority: "HIGH",
    status: "COMPLETED",
    location: "1205 West Chester Pike, Havertown, PA",
    baseCompensation: "120",
    scheduledAt: "2026-01-10T10:00:00.000Z",
    createdAt: "2026-01-05T04:32:03.527Z",
  },
];

const LiveFeed = () => {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Recently Posted
            </h2>
            <p className="text-muted-foreground mt-2">
              Real people needing help right now.
            </p>
          </div>
          <Button
            variant="link"
            className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            asChild
          >
            <Link href="/tasks">
              View all tasks <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TASKS.map((task) => (
            <LiveFeedTaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/tasks"
            className="text-blue-600 font-semibold inline-flex items-center"
          >
            View all tasks <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LiveFeed;
