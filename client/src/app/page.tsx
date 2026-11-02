
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Heart,
  Leaf,
  HandHeart,
  GraduationCap,
  Sparkles,
  Loader2,
  RefreshCw,
  Search,
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
};

const features = [
  {
    icon: Users,
    title: "Build Connections",
    description:
      "Meet like-minded people and build meaningful relationships in your community.",
  },
  {
    icon: Leaf,
    title: "Make an Impact",
    description:
      "Take part in environmental initiatives and create a cleaner, greener future.",
  },
  {
    icon: HandHeart,
    title: "Help Each Other",
    description:
      "Join donation drives and community support programs that make a difference.",
  },
  {
    icon: GraduationCap,
    title: "Learn Together",
    description:
      "Share knowledge, develop new skills and grow together through community activities.",
  },
];

const gallery = [
  {
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    title: "Community Together",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
    title: "Making Connections",
  },
  {
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800",
    title: "Helping Hands",
  },
  {
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800",
    title: "A Greener Future",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
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

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLatestEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/events?limit=6`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load events."
        );
      }

      setEvents((result.events || []).slice(0, 6));
    } catch (err) {
      console.error("Home events error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestEvents();
  }, []);

  return (
    <main className="overflow-hidden">

      {/* ================= HERO ================= */}

      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-blue-500/10" />

        <div className="container mx-auto grid min-h-[620px] items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              Together We Can Make a Difference
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Connect People.
              <span className="block bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Create Impact.
              </span>
              Change Communities.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Discover local events, meet inspiring people and
              become part of meaningful community initiatives.
              Your small contribution can create a big change.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/upcoming-events"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              >
                Explore Events
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/create-event"
                className="inline-flex h-12 items-center justify-center rounded-md border bg-background px-6 text-sm font-semibold transition hover:bg-muted"
              >
                Create an Event
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-extrabold">Together</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Stronger Communities
                </p>
              </div>

              <div>
                <p className="text-2xl font-extrabold">Every Day</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  New Opportunities
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-primary/20 to-blue-500/20 blur-2xl" />

            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200"
              alt="People working together in a community"
              className="relative h-[360px] w-full rounded-3xl object-cover shadow-2xl sm:h-[480px]"
            />

            <div className="absolute -bottom-5 left-4 rounded-2xl border bg-card p-4 shadow-xl sm:left-8 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Be the Change</p>
                  <p className="text-xs text-muted-foreground">
                    Your community needs you
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Why SocialConnect
          </p>

          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            A Better Way to Build Community
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Bring people together through shared goals,
            meaningful activities and positive experiences.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= UPCOMING EVENTS ================= */}

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Be Part of Something Good
              </p>

              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Upcoming Events
              </h2>

              <p className="mt-3 text-muted-foreground">
                Discover the latest opportunities to make an impact.
              </p>
            </div>

            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <EventSkeleton key={item} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border bg-card px-5 py-14 text-center">
              <p className="font-semibold">
                Could not load upcoming events.
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                className="mt-5"
                onClick={fetchLatestEvents}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border bg-card px-5 py-14 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-primary" />

              <h3 className="mt-4 text-xl font-bold">
                No Upcoming Events Yet
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Be the first to create a community event.
              </p>

              <Link
                href="/create-event"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Create an Event
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
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

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                        {formatDate(event.eventDate)}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-primary" />
                        <span className="line-clamp-1">
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/upcoming-events/${event._id}`}
                      className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ================= COMMUNITY GALLERY ================= */}

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Our Community
          </p>

          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Small Actions. Big Changes.
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Every helping hand, every shared moment and every
            positive action brings us closer together.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {gallery.map((item) => (
            <div
              key={item.title}
              className="group relative h-52 overflow-hidden rounded-2xl sm:h-64"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <h3 className="absolute bottom-4 left-4 right-4 text-sm font-bold text-white sm:text-lg">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}

      <section className="container mx-auto px-4 pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-blue-600 px-6 py-14 text-center text-white sm:px-12">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Heart className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              Stay Connected With Your Community
            </h2>

            <p className="mt-4 leading-7 text-white/80">
              Discover new opportunities, meaningful events
              and ways to make a difference.
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-12 border-white/30 bg-white text-foreground placeholder:text-muted-foreground"
              />

              <Button
                type="button"
                variant="secondary"
                className="h-12 shrink-0"
               onClick={() =>
  toast.info("Newsletter subscription is coming soon!")
}
              >
                Subscribe
              </Button>
            </div>

            <p className="mt-4 text-xs text-white/70">
              Newsletter subscription is a UI preview.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}

      <section className="border-t bg-muted/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to Make a Difference?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start your journey with SocialConnect and help
            create a stronger, more connected community.
          </p>

          <Link
            href="/upcoming-events"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </main>
  );
}
