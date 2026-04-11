import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Keep 100% of your tips",
  "Work when you want, where you want",
  "Instant payouts to your bank",
  "Build your reputation & career",
];

const BecomeHelper = () => {
  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-purple-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-sm font-medium mb-6">
              For Taskers & Pros
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Earn money doing what you love.
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-lg">
              Turn your skills into cash. Whether you&apos;re a handy pro, a
              cleaner, or a developer, find work that fits your schedule.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((item, idx) => (
                <li key={idx} className="flex items-center text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 px-8 rounded-full"
                asChild
              >
                <Link href="/register?role=helper">
                  Become a Tasker
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Visual (Mock Dashboard Card) */}
          <div className="relative">
            {/* Decorative glowing gradient behind the card */}
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>

            <Card className="relative bg-slate-800 border-slate-700 text-white p-2">
              <CardContent className="p-6">
                {/* Card Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">
                      Weekly Earnings
                    </p>
                    <h3 className="text-3xl font-bold text-white mt-1">
                      $840.50
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                    <TrendingUp size={24} />
                  </div>
                </div>

                {/* Mock Graph Bars */}
                <div className="flex items-end justify-between gap-2 h-32 mb-8">
                  {[40, 65, 30, 85, 50, 90, 60].map((h, i) => (
                    <div
                      key={i}
                      className="w-full bg-slate-700 rounded-t-sm hover:bg-blue-500 transition-colors cursor-pointer relative group"
                    >
                      <div
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500"
                        style={{ height: `${h}%` }}
                      ></div>
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${h * 4}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity Mini-List */}
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Recent Completed Tasks
                  </p>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                        <Wallet size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Furniture Assembly
                        </p>
                        <p className="text-xs text-slate-400">Today, 2:30 PM</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-bold">+$65.00</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                        <Wallet size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Moving Help</p>
                        <p className="text-xs text-slate-400">Yesterday</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-bold">+$120.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl  items-center gap-3 animate-bounce-slow hidden md:flex">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Payment Verified</p>
                <p className="text-xs text-slate-500">Instant Transfer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeHelper;
