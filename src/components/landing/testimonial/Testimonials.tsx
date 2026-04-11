import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    content:
      "I needed my entire apartment cleaned before a move-out inspection. I posted the task, and within 20 minutes I had 3 great offers. The helper was professional and fast!",
    author: "Sarah Chen",
    role: "Task Creator",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    tag: "Home Cleaning",
  },
  {
    content:
      "GetItDone has completely changed how I work. I pick up tasks on my weekends and make an extra $800/month assembling furniture. The instant payout is a game changer.",
    author: "Marcus Johnson",
    role: "Super Helper",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    tag: "Assembly",
  },
  {
    content:
      "As a small business owner, I often need last-minute help with deliveries. This app is a lifesaver. The tracking feature and escrow payment give me total peace of mind.",
    author: "Emily Rodriguez",
    role: "Business Owner",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    tag: "Delivery",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Trusted by thousands
          </h2>
          <p className="text-lg text-gray-600">
            Don&apos;t just take our word for it. See what our community has to
            say about their experience.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <Card
              key={idx}
              className="border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow duration-300 relative overflow-visible mt-6 md:mt-0"
            >
              {/* Floating Quote Icon */}
              <div className="absolute -top-6 left-8 bg-blue-600 rounded-full p-3 shadow-lg transform -rotate-12">
                <Quote className="w-5 h-5 text-white fill-current" />
              </div>

              <CardContent className="pt-12 pb-8 px-8">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-600 leading-relaxed mb-8 italic">
                  &quot;{item.content}&quot;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 mt-auto">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={item.image} alt={item.author} />
                    <AvatarFallback>{item.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {item.author}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
