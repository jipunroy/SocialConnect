
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Loader2,
  RefreshCw,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Stats = {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalJoinedMembers: number;
  communityMembers: number;
};

type Category = {
  _id: string;
  count: number;
};

type MonthlyActivity = {
  _id: {
    year: number;
    month: number;
  };
  total: number;
};

type ImpactData = {
  success: boolean;
  stats: Stats;
  eventCategories: Category[];
  monthlyActivity: MonthlyActivity[];
};

const emptyStats: Stats = {
  totalEvents: 0,
  upcomingEvents: 0,
  completedEvents: 0,
  totalJoinedMembers: 0,
  communityMembers: 0,
};

function formatMonth(year: number, month: number) {
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="group min-w-0 rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15 sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
        </div>

        <Activity className="h-5 w-5 shrink-0 text-muted-foreground/40" />
      </div>

      <p className="mt-5 text-sm font-medium text-muted-foreground">
        {title}
      </p>

      <h2 className="mt-1 break-words text-3xl font-bold tracking-tight sm:text-4xl">
        {value.toLocaleString()}
      </h2>

      <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
        {description}
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <section>
        <div className="mb-5 h-7 w-48 animate-pulse rounded-lg bg-muted" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl border bg-muted/50"
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-[360px] animate-pulse rounded-2xl border bg-muted/50"
          />
        ))}
      </section>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border bg-card px-4 py-3 shadow-lg">
      <p className="mb-1 text-sm font-medium">{label}</p>
      <p className="text-sm font-semibold text-primary">
        {payload[0].value} Events
      </p>
    </div>
  );
}

export default function ImpactDashboardPage() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/impact/stats`, {
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned an invalid response.");
      }

      const result: ImpactData & { message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load dashboard."
        );
      }

      setData(result);
    } catch (err) {
      console.error("Impact dashboard error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const stats = data?.stats || emptyStats;

  const categories = (data?.eventCategories || []).map((item) => ({
    category: item._id || "Other",
    events: item.count,
  }));

  const monthlyActivity = (data?.monthlyActivity || []).map((item) => ({
    month: formatMonth(item._id.year, item._id.month),
    events: item.total,
  }));

  return (
    <div className="container-custom min-h-screen py-10 sm:py-12 md:py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
            Community Impact
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Together, We Make a Difference
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Explore the events, participation and positive community
            activity created through SocialConnect.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void fetchStats()}
          disabled={loading}
          className="h-11 w-full shrink-0 sm:w-auto"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh Data
        </Button>
      </div>

      {error && !data && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Activity className="h-6 w-6 text-destructive" />
          </div>

          <h2 className="mt-4 text-lg font-bold">
            Unable to load community statistics
          </h2>

          <p className="mt-2 break-words text-sm text-muted-foreground">
            {error}
          </p>

          <Button
            onClick={() => void fetchStats()}
            className="mt-5"
          >
            Try Again
          </Button>
        </div>
      )}

      {loading && !data && <DashboardSkeleton />}

      {data && (
        <>
          <section className="mb-10 sm:mb-14">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold sm:text-2xl">
                  Community Overview
                </h2>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Live statistics from our community database.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              <StatCard
                title="Total Events"
                value={stats.totalEvents}
                description="Events created by our community"
                icon={CalendarDays}
              />

              <StatCard
                title="Upcoming Events"
                value={stats.upcomingEvents}
                description="Events scheduled for the future"
                icon={Clock}
              />

              <StatCard
                title="Completed Events"
                value={stats.completedEvents}
                description="Events whose scheduled date has passed"
                icon={CheckCircle2}
              />

              <StatCard
                title="Total Joined Members"
                value={stats.totalJoinedMembers}
                description="Total event registrations"
                icon={HeartHandshake}
              />

              <StatCard
                title="Community Members"
                value={stats.communityMembers}
                description="Unique members who joined events"
                icon={Users}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold sm:text-xl">
                  Events by Category
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Distribution of community event types.
                </p>
              </div>

              {categories.length > 0 ? (
                <div className="h-[280px] w-full sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categories}
                      margin={{
                        top: 10,
                        right: 8,
                        left: -22,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.25}
                      />

                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        width={35}
                      />

                      <Tooltip content={<ChartTooltip />} />

                      <Bar
                        dataKey="events"
                        name="Events"
                        fill="#6C4CF1"
                        radius={[7, 7, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[280px] flex-col items-center justify-center text-center sm:h-[320px]">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No event category data available yet.
                  </p>
                </div>
              )}
            </div>

            <div className="min-w-0 rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold sm:text-xl">
                  Monthly Event Activity
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Events created during the last six months.
                </p>
              </div>

              {monthlyActivity.length > 0 ? (
                <div className="h-[280px] w-full sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyActivity}
                      margin={{
                        top: 10,
                        right: 12,
                        left: -22,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.25}
                      />

                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        width={35}
                      />

                      <Tooltip content={<ChartTooltip />} />

                      <Line
                        type="monotone"
                        dataKey="events"
                        name="Events"
                        stroke="#3478F6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[280px] flex-col items-center justify-center text-center sm:h-[320px]">
                  <Activity className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No monthly activity data available yet.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="gradient-bg mt-10 overflow-hidden rounded-2xl p-6 text-white shadow-lg sm:mt-12 sm:p-8 md:p-10">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex rounded-xl bg-white/15 p-3">
                <HeartHandshake className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Small Actions. Big Impact.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/85 sm:text-base">
                Every event, every volunteer and every act of kindness
                helps build a stronger community. Join SocialConnect
                and become part of the change.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
