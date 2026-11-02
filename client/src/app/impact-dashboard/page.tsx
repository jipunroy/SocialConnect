
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Loader2,
  RefreshCw,
  Users,
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

// ======================================
// MONTH LABEL FORMATTER
// ======================================

function formatMonth(year: number, month: number) {
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

// ======================================
// STATISTICS CARD
// ======================================

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
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>

        <Activity className="h-5 w-5 text-muted-foreground/50" />
      </div>

      <p className="mt-5 text-sm font-medium text-muted-foreground">
        {title}
      </p>

      <h2 className="mt-1 text-3xl font-bold tracking-tight">
        {value.toLocaleString()}
      </h2>

      <p className="mt-2 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

// ======================================
// LOADING SKELETON
// ======================================

function DashboardSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-2xl border bg-muted/50"
        />
      ))}
    </div>
  );
}

// ======================================
// COMMUNITY IMPACT DASHBOARD
// ======================================

export default function ImpactDashboardPage() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/impact/stats`,
        { cache: "no-store" }
      );

      const result = await response.json();

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
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
    <div className="container-custom min-h-screen py-12 md:py-16">
      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Community Impact
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Together, We Make a Difference
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Explore the events, participation and positive
            community activity created through SocialConnect.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchStats}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh Data
        </Button>
      </div>

      {/* ======================================
          ERROR STATE
      ====================================== */}

      {error && !data && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-semibold">
            Unable to load community statistics.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <Button
            onClick={fetchStats}
            className="mt-5"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* ======================================
          LOADING STATE
      ====================================== */}

      {loading && !data && <DashboardSkeleton />}

      {/* ======================================
          DASHBOARD CONTENT
      ====================================== */}

      {data && (
        <>
          {/* STATISTICS */}

          <section className="mb-12">
            <div className="mb-5">
              <h2 className="text-xl font-bold">
                Community Overview
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Live statistics from our community database.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

          {/* CHARTS */}

          <section className="grid gap-6 lg:grid-cols-2">
            {/* EVENT CATEGORY CHART */}

            <div className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Events by Category
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Distribution of community event types.
                </p>
              </div>

              {categories.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categories}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -15,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.25}
                      />

                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="events"
                        name="Events"
                        fill="#6C4CF1"
                        radius={[7, 7, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                  No event category data available yet.
                </div>
              )}
            </div>

            {/* MONTHLY ACTIVITY CHART */}

            <div className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  Monthly Event Activity
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Events created during the last six months.
                </p>
              </div>

              {monthlyActivity.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyActivity}
                      margin={{
                        top: 10,
                        right: 15,
                        left: -15,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.25}
                      />

                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="events"
                        name="Events"
                        stroke="#3478F6"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                  No monthly activity data available yet.
                </div>
              )}
            </div>
          </section>

          {/* BOTTOM MESSAGE */}

          <section className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-8 text-white md:p-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold md:text-3xl">
                Small Actions. Big Impact.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/85 md:text-base">
                Every event, every volunteer and every act of
                kindness helps build a stronger community.
                Join SocialConnect and become part of the change.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
