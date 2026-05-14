import type { Metadata } from "next";
import type {
  PublicReview,
  PublicTask,
} from "@/actions/user/getPublicProfileAction";
import { getPublicProfileAction } from "@/actions/user/getPublicProfileAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  MapPin,
  Star,
  UserCheck,
} from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPublicProfileAction(id);
  if (!result.success || !("data" in result)) {
    return { title: "User Not Found" };
  }
  const profile = result.data;
  const description = profile.bio
    ? profile.bio.slice(0, 150).replace(/\s+\S*$/, "") + "…"
    : `View ${profile.name}'s tasks and reviews on Doable.`;
  return {
    title: profile.name,
    description,
    openGraph: {
      title: `${profile.name} | Doable`,
      description,
      images: profile.image
        ? [{ url: profile.image, width: 400, height: 400, alt: profile.name }]
        : [{ url: "/og-image.png", width: 1200, height: 630, alt: profile.name }],
    },
  };
}

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
};

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function formatRating(val: number | null) {
  return val !== null ? `${val.toFixed(1)} / 5` : "—";
}

function formatRate(val: number | null) {
  return val !== null ? `${(val * 100).toFixed(0)}%` : "—";
}

function TaskRow({ task }: { task: PublicTask }) {
  const statusClass = STATUS_STYLES[task.status] ?? STATUS_STYLES.CANCELLED;
  const date = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <Badge variant="secondary" className="text-xs">
          {task.category}
        </Badge>
        <Badge variant="outline" className={`text-xs border ${statusClass}`}>
          {task.status.replace("_", " ")}
        </Badge>
      </div>
      <p className="text-sm font-semibold text-slate-800 mb-1">{task.title}</p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="font-medium text-green-700">
          ${parseFloat(task.baseCompensation).toLocaleString()}
        </span>
        <span className="flex items-center gap-1 min-w-0">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-60">{task.location}</span>
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="w-3 h-3 shrink-0" />
          {date}
        </span>
      </div>
    </div>
  );
}

function ReviewRow({ review }: { review: PublicReview }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const initials = review.reviewer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          {review.reviewer.image && (
            <AvatarImage
              src={review.reviewer.image}
              alt={review.reviewer.name}
            />
          )}
          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-800">
              {review.reviewer.name}
            </span>
            <span className="text-xs text-slate-400 shrink-0">{date}</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < review.rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200 fill-slate-200"
                }`}
              />
            ))}
          </div>
          {review.comment && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getPublicProfileAction(id);

  if (!result.success || !("data" in result)) {
    if ("statusCode" in result && result.statusCode === 404) {
      notFound();
    }
    return (
      <div className="min-h-screen bg-gray-50/50 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Failed to load profile
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                {"message" in result
                  ? result.message
                  : "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profile = result.data;
  const { asPoster, asDoer } = profile.stats;

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(profile.memberSince).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl space-y-6">
        {/* Profile Header */}
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <Avatar className="h-20 w-20 shrink-0 ring-4 ring-blue-100">
                {profile.image && (
                  <AvatarImage src={profile.image} alt={profile.name} />
                )}
                <AvatarFallback className="text-2xl font-bold bg-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  {profile.name}
                </h1>
                <p className="text-sm text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Member since {memberSince}
                </p>
                {profile.bio && (
                  <>
                    <Separator className="my-3" />
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {profile.bio}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* As Poster */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                As Task Poster
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <StatRow
                label="Tasks Posted"
                value={String(asPoster.tasksPosted)}
              />
              <StatRow
                label="Avg. Rating"
                value={formatRating(asPoster.averageRating)}
              />
              <StatRow label="Reviews" value={String(asPoster.reviewCount)} />
            </CardContent>
          </Card>

          {/* As Doer */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                As Task Doer
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <StatRow
                label="Tasks Completed"
                value={String(asDoer.tasksCompleted)}
              />
              <StatRow
                label="Completion Rate"
                value={formatRate(asDoer.completionRate)}
              />
              <StatRow
                label="Avg. Rating"
                value={formatRating(asDoer.averageRating)}
              />
              <StatRow label="Reviews" value={String(asDoer.reviewCount)} />
            </CardContent>
          </Card>
        </div>

        {/* Posted Tasks */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="pb-0 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-slate-800">
              Posted Tasks
              <Badge variant="secondary" className="ml-2 text-xs font-medium">
                {profile.postedTasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-2">
            {profile.postedTasks.length === 0 ? (
              <div className="py-10 text-center">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No tasks posted yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {profile.postedTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="pb-0 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-slate-800">
              Reviews
              <Badge variant="secondary" className="ml-2 text-xs font-medium">
                {profile.reviews.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-2">
            {profile.reviews.length === 0 ? (
              <div className="py-10 text-center">
                <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No reviews yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {profile.reviews.map((review) => (
                  <ReviewRow key={review.id} review={review} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
