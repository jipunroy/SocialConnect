"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  CalendarDays,
  MapPin,
  UserRound,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

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
  creatorEmail?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// EVENT DETAILS CONTENT

function EventDetailsContent({
  eventId,
}: {
  eventId: string;
}) {
  const router = useRouter();

  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  // FETCH EVENT DETAILS

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/events/${eventId}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load event details."
          );
        }

        setEvent(result.event);
      } catch (err) {
        console.error("Event details error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // CHECK JOINED STATUS

  useEffect(() => {
    const checkJoinedStatus = async () => {
      if (!session?.user) {
        setJoined(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/events/joined`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          return;
        }

        const joinedEvents = result.events || [];

        const alreadyJoined = joinedEvents.some(
          (item: {
            eventId?: string;
            _id?: string;
            event?: { _id?: string };
          }) =>
            String(
              item.eventId ||
                item.event?._id ||
                item._id
            ) === eventId
        );

        setJoined(alreadyJoined);
      } catch (err) {
        console.error("Join status check error:", err);
      }
    };

    if (!sessionPending) {
      checkJoinedStatus();
    }
  }, [session, sessionPending, eventId]);

  // JOIN EVENT

  const handleJoinEvent = async () => {
    if (!session?.user) {
      toast.error("Please login to join this event.");
      router.push("/login");
      return;
    }

    if (!event) return;

    if (new Date(event.eventDate).getTime() <= Date.now()) {
      toast.error("This event has already started or ended.");
      return;
    }

    if (joined) {
      toast.info("You have already joined this event.");
      return;
    }

    try {
      setJoining(true);

      const response = await fetch(
        `${API_URL}/api/events/${eventId}/join`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to join this event."
        );
      }

      setJoined(true);

      toast.success("You joined this event successfully!");
    } catch (err) {
      console.error("Join event error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while joining."
      );
    } finally {
      setJoining(false);
    }
  };

  // LOADING STATE

  if (loading || sessionPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  // ERROR STATE

  if (error || !event) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-5 text-destructive">
          <CalendarDays className="h-10 w-10" />
        </div>

        <h2 className="mt-5 text-2xl font-bold">
          Event Not Found
        </h2>

        <p className="mt-2 max-w-md text-muted-foreground">
          {error ||
            "The event you are looking for does not exist."}
        </p>

        <Button
          className="mt-6"
          onClick={() => router.push("/upcoming-events")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>
    );
  }

  const eventHasPassed =
    new Date(event.eventDate).getTime() <= Date.now();

  // MAIN EVENT DETAILS UI

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Back Navigation */}

      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Upcoming Events
        </Link>
      </div>

      {/* Main Content */}

      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_350px]">

          {/* LEFT: EVENT INFORMATION */}

          <div className="min-w-0">
            {/* Event Image */}

            <div className="relative overflow-hidden rounded-2xl bg-muted">
              <img
                src={event.thumbnail}
                alt={event.title}
                className="h-[280px] w-full object-cover sm:h-[420px]"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/1200x600?text=Community+Event";
                }}
              />

              <span className="absolute left-5 top-5 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-primary shadow backdrop-blur">
                {event.eventType}
              </span>
            </div>

            {/* Event Title */}

            <div className="mt-8">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {event.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {formatDate(event.eventDate)}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {formatTime(event.eventDate)}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {event.location}
                </div>
              </div>
            </div>

            {/* Description */}

            <div className="mt-10 rounded-2xl border bg-card p-6 sm:p-8">
              <h2 className="text-xl font-bold">
                About This Event
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground sm:text-base">
                {event.description}
              </p>
            </div>

            {/* Organizer */}

            <div className="mt-6 rounded-2xl border bg-card p-6">
              <h2 className="text-lg font-bold">
                Event Organizer
              </h2>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-semibold">
                    {event.creatorName || "Community Organizer"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Event Creator
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: JOIN EVENT SIDEBAR */}

          <aside>
            <div className="sticky top-24 rounded-2xl border bg-card p-6 shadow-sm">
              {/* Sidebar Heading */}

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Users className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-bold">
                    Join This Event
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Be part of the community
                  </p>
                </div>
              </div>

              {/* Event Information */}

              <div className="my-6 space-y-4 border-y py-5">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-primary" />

                  <div>
                    <p className="text-sm font-medium">
                      Event Date
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />

                  <div>
                    <p className="text-sm font-medium">
                      Starting Time
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatTime(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />

                  <div>
                    <p className="text-sm font-medium">
                      Location
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Join Button */}

              {joined ? (
                <div className="rounded-xl bg-green-500/10 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-green-600" />

                  <p className="mt-2 font-semibold text-green-700 dark:text-green-400">
                    You have joined!
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    This event is now in your joined events.
                  </p>

                  <Link
                    href="/joined-events"
                    className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    View Joined Events
                  </Link>
                </div>
              ) : (
                <Button
                  className="h-12 w-full"
                  disabled={joining || eventHasPassed}
                  onClick={handleJoinEvent}
                >
                  {joining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : eventHasPassed ? (
                    "Event Has Ended"
                  ) : (
                    <>
                      Join Event
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}

              {!session?.user && !eventHasPassed && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Please login to participate in this event.
                </p>
              )}

              <p className="mt-5 text-center text-xs text-muted-foreground">
                Connect with people and make a positive impact.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

// SUSPENSE FALLBACK

function EventDetailsLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-primary" />

        <p className="text-sm text-muted-foreground">
          Loading event...
        </p>
      </div>
    </div>
  );
}

// PAGE COMPONENT

function EventDetailsPageContent() {
  const params = useParams<{ id: string }>();

  const eventId = params.id;

  return <EventDetailsContent eventId={eventId} />;
}

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<EventDetailsLoading />}>
      <EventDetailsPageContent />
    </Suspense>
  );
}