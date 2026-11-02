
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Loader2,
  Users,
  ArrowRight,
  Search,
  RefreshCw,
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

function JoinedEventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchJoinedEvents = async () => {
    try {
      setLoading(true);

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

      // Supports both direct event objects and nested event objects.
      const joinedEvents = (result.events || [])
        .map((item: Event) => item.event || item)
        .filter((item: Event) => item && item._id);

      setEvents(joinedEvents);
    } catch (error) {
      console.error("Joined events error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load joined events."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const query = search.toLowerCase();

    return (
      event.title?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.eventType?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              My Joined Events
            </h1>

            <p className="mt-3 text-muted-foreground">
              Explore the community events you have joined
              and stay connected.
            </p>

            <div className="mt-6 flex justify-center">
              <div className="rounded-full border bg-card px-5 py-2 text-sm">
                <span className="font-bold text-primary">
                  {events.length}
                </span>{" "}
                <span className="text-muted-foreground">
                  Joined Events
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Your Events
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Events you are participating in.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your events..."
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
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

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border bg-card"
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border bg-card px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarDays className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              {search
                ? "No matching events found"
                : "You haven't joined any events yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {search
                ? "Try another search keyword."
                : "Discover upcoming community events and join one to get started."}
            </p>

            <Link
              href="/upcoming-events"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 overflow-hidden bg-muted">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=Community+Event";
                    }}
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
                    {event.eventType}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-bold">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                      {new Date(event.eventDate).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t pt-4">
                    <Link
                      href={`/upcoming-events/${event._id}`}
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                      View Event
                      <ArrowRight className="h-4 w-4" />
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
