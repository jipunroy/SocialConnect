
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
  Plus,
  X,
  Save,
  RefreshCw,
  Search,
  ArrowRight,
  AlertCircle,
  Clock,
  CalendarCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProtectedRoute } from "@/components/auth/protected-route";

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

type EventForm = {
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

const emptyForm: EventForm = {
  title: "",
  description: "",
  eventType: "Cleanup",
  thumbnail: "",
  location: "",
  eventDate: "",
};

function toLocalDateTime(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  const timezoneOffset = value.getTimezoneOffset() * 60000;

  return new Date(value.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
}

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
      <div className="h-48 animate-pulse bg-muted" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

function ManageEventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(
        `${API_URL}/api/events/my-events`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load your events."
        );
      }

      setEvents(result.events || []);
    } catch (error) {
      console.error("Manage events error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to load events.";

      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

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

  const updateField = (
    field: keyof EventForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleEdit = (event: Event) => {
    setEditingId(event._id);

    setForm({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: toLocalDateTime(event.eventDate),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingId) return;

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.thumbnail.trim() ||
      !form.location.trim() ||
      !form.eventDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const imageUrl = new URL(form.thumbnail);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        throw new Error("Invalid image URL");
      }
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }

    const selectedDate = new Date(form.eventDate);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() <= Date.now()
    ) {
      toast.error("Please select a future event date.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/events/${editingId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            title: form.title.trim(),
            description: form.description.trim(),
            thumbnail: form.thumbnail.trim(),
            location: form.location.trim(),
            eventDate: selectedDate.toISOString(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Event update failed."
        );
      }

      toast.success("Event updated successfully!");

      setEditingId(null);
      setForm(emptyForm);

      await fetchMyEvents();
    } catch (error) {
      console.error("Update event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update event."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const eventId = deleteTarget._id;

    try {
      setDeletingId(eventId);

      const response = await fetch(
        `${API_URL}/api/events/${eventId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Event deletion failed."
        );
      }

      toast.success("Event deleted successfully!");

      setEvents((previous) =>
        previous.filter((event) => event._id !== eventId)
      );

      if (editingId === eventId) {
        handleCancelEdit();
      }

      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete event."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Page Header */}
      <section className="relative overflow-hidden border-b bg-background">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-12 sm:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Event Management
              </p>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Manage My Events
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Manage your community events, update event
                information and keep everything organized.
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create New Event
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-3 rounded-2xl border bg-card px-5 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-extrabold tabular-nums">
                  {events.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Events Created
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14">
        {/* Edit Form */}
        {editingId && (
          <div
            id="edit-event-form"
            className="mb-10 scroll-mt-24 rounded-2xl border bg-card p-5 shadow-sm sm:p-8"
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Update Information
                </p>

                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  Edit Event
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Make changes to your event details below.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 rounded-xl"
                onClick={handleCancelEdit}
                disabled={saving}
                aria-label="Cancel editing"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Event Title</Label>
                  <Input
                    id="edit-title"
                    value={form.title}
                    onChange={(e) =>
                      updateField("title", e.target.value)
                    }
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type">Event Type</Label>
                  <select
                    id="edit-type"
                    value={form.eventType}
                    onChange={(e) =>
                      updateField("eventType", e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Cleanup">Cleanup</option>
                    <option value="Plantation">Plantation</option>
                    <option value="Donation">Donation</option>
                    <option value="Education">Education</option>
                    <option value="Community">Community</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-image">
                    Thumbnail Image URL
                  </Label>
                  <Input
                    id="edit-image"
                    type="url"
                    value={form.thumbnail}
                    onChange={(e) =>
                      updateField("thumbnail", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={form.location}
                    onChange={(e) =>
                      updateField("location", e.target.value)
                    }
                    placeholder="Enter event location"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-date">
                    Event Date & Time
                  </Label>
                  <Input
                    id="edit-date"
                    type="datetime-local"
                    min={toLocalDateTime(new Date().toISOString())}
                    value={form.eventDate}
                    onChange={(e) =>
                      updateField("eventDate", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-description">
                    Event Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    placeholder="Describe your community event..."
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t pt-5">
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {saving ? "Updating..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Events Heading and Search */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Your Activities
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Your Created Events
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Only events created by your account are shown here.
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
              onClick={fetchMyEvents}
              disabled={loading}
              aria-label="Refresh events"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </div>

        {!loading && !loadError && (
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
        ) : loadError ? (
          /* Error State */
          <div className="rounded-2xl border bg-card px-5 py-16 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />

            <h3 className="mt-5 text-xl font-bold">
              Unable to load your events
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {loadError}
            </p>

            <Button
              onClick={fetchMyEvents}
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
                : "No Events Created Yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {search
                ? "Try another search keyword or clear your search."
                : "Start creating meaningful community events and bring people together."}
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
                href="/create-event"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create Your First Event
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
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={
                      event.thumbnail ||
                      "https://placehold.co/600x400?text=Community+Event"
                    }
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=Community+Event";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-background/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                    {event.eventType}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-bold transition-colors group-hover:text-primary">
                    {event.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                      <span>{formatDate(event.eventDate)}</span>
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

                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => handleEdit(event)}
                      disabled={deletingId === event._id}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full rounded-xl"
                      onClick={() => setDeleteTarget(event)}
                      disabled={deletingId === event._id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  <Link
                    href={`/upcoming-events/${event._id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    View Event Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deletingId) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl sm:p-7"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h2
              id="delete-dialog-title"
              className="mt-5 text-xl font-bold"
            >
              Delete this event?
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setDeleteTarget(null)}
                disabled={Boolean(deletingId)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                className="rounded-xl"
                onClick={handleDelete}
                disabled={Boolean(deletingId)}
              >
                {deletingId ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {deletingId ? "Deleting..." : "Yes, Delete Event"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <ProtectedRoute>
      <ManageEventsContent />
    </ProtectedRoute>
  );
}
