
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  CalendarDays,
  MapPin,
  Search,
  SlidersHorizontal,
  ArrowRight,
  CalendarX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName?: string;
};

const categories = [
  "All",
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Community",
  "Other",
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Event Loading Skeleton
function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="h-52 animate-pulse bg-muted" />

      <div className="space-y-4 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

// Event Card
function EventCard({ event }: { event: Event }) {
  return (
    <article className="group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/800x500?text=Community+Event";
          }}
        />

        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
          {event.eventType}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="line-clamp-1 text-xl font-bold transition-colors group-hover:text-primary">
          {event.title}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-muted-foreground">
          {event.description}
        </p>

        {/* Event Information */}
        <div className="mt-5 space-y-3 border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
            <span>{formatDate(event.eventDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* View Details */}
        <Link
          href={`/upcoming-events/${event._id}`}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

// Main Page
export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Fetch Events from MongoDB
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/events`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load events."
          );
        }

        setEvents(result.events || []);
      } catch (err) {
        console.error("Fetch events error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Search and Category Filter
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || event.eventType === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  return (
    <div className="min-h-screen bg-muted/20">

      {/* ================= HERO SECTION ================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-blue-500/10 py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">

          <span className="inline-flex items-center rounded-full border bg-background/70 px-4 py-2 text-sm font-medium text-primary">
            <CalendarDays className="mr-2 h-4 w-4" />
            Make a Difference Together
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Events
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground sm:text-lg">
            Discover meaningful community events, connect with people,
            and take part in creating positive change.
          </p>

          <div className="mt-8">
            <Link
              href="/create-event"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Create an Event
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= EVENTS SECTION ================= */}

      <section className="container mx-auto px-4 py-14">

        {/* Section Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Explore & Participate
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Find Your Next Event
            </h2>

            <p className="mt-2 text-muted-foreground">
              Discover opportunities happening in your community.
            </p>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            {loading
              ? "Loading events..."
              : `${filteredEvents.length} events found`}
          </p>

        </div>

        {/* Search and Filter */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search by title, location or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border bg-card px-3">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 min-w-32 bg-transparent text-sm outline-none"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EventSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">

            <p className="font-semibold text-destructive">
              {error}
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>

          </div>
        )}

        {/* Event Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-card px-5 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarX className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              No Events Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {events.length === 0
                ? "There are no upcoming events yet. Be the first to create one!"
                : "Try changing your search or category filter."}
            </p>

            {events.length === 0 ? (
              <Link
                href="/create-event"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Create First Event
              </Link>
            ) : (
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear Filters
              </Button>
            )}

          </div>
        )}

      </section>
    </div>
  );
}
