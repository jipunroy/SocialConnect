
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Loader2,
  Users,
  ArrowRight,
  Search,
  RefreshCw,
  CalendarCheck,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/auth/protected-route";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Event = {
  _id: string;
  eventId?: string;
  title: string;
  description?: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName?: string;
  event?: Event;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="h-52 animate-pulse bg-muted" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

function JoinedEventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchJoinedEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/events/joined`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load joined events."
        );
      }

      const joinedEvents = (result.events || [])
        .map((item: Event) => item.event || item)
        .filter((item: Event) => item && item._id);

      setEvents(joinedEvents);
    } catch (error) {
      console.error("Joined events error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to load joined events.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJoinedEvents();
  }, [fetchJoinedEvents]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) => {
      return (
        event.title?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.eventType?.toLowerCase().includes(query)
      );
    });
  }, [events, search]);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-background">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-14 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <Users className="h-8 w-8" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Your Community Journey
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              My Joined Events
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Keep track of the community events you have joined.
              Stay involved, meet new people and make a positive impact.
            </p>

            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border bg-card px-6 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarCheck className="h-5 w-5" />
              </div>

              <div className="text-left">
                <p className="text-2xl font-extrabold tabular-nums">
                  {events.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Events Joined
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Your Participation
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Your Events
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Events you are participating in.
            </p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your events..."
                className="h-11 rounded-xl pl-9"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl"
              onClick={fetchJoinedEvents}
              disabled={loading}
              aria-label="Refresh joined events"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </div>

        {!loading && !error && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredEvents.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {events.length}
              </span>{" "}
              events
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="font-medium text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <EventSkeleton key={item} />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="rounded-2xl border bg-card px-5 py-16 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />

            <h3 className="mt-5 text-xl font-bold">
              Unable to load your events
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              onClick={fetchJoinedEvents}
              className="mt-6 rounded-xl"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border bg-card px-5 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {search ? (
                <Search className="h-8 w-8" />
              ) : (
                <CalendarDays className="h-8 w-8" />
              )}
            </div>

            <h3 className="mt-5 text-xl font-bold">
              {search
                ? "No matching events found"
                : "You haven't joined any events yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {search
                ? "Try another search keyword or clear your search."
                : "Discover upcoming community events and join one to get started."}
            </p>

            {search ? (
              <Button
                variant="outline"
                className="mt-6 rounded-xl"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            ) : (
              <Link
                href="/upcoming-events"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Explore Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          /* Event Cards */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden bg-muted">
                  <img
                    src={event.thumbnail || "https://placehold.co/600x400?text=Community+Event"}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=Community+Event";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-background/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                    {event.eventType}
                  </span>

                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <CalendarCheck className="h-3.5 w-3.5" />
                    Joined
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-bold transition-colors group-hover:text-primary">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {new Date(event.eventDate).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t pt-4">
                    <Link
                      href={`/upcoming-events/${event._id}`}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      View Event Details
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function JoinedEventsPage() {
  return (
    <ProtectedRoute>
      <JoinedEventsContent />
    </ProtectedRoute>
  );
}
