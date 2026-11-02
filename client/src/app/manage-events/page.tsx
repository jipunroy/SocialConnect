
"use client";

import { useEffect, useState } from "react";
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
  const timezoneOffset = value.getTimezoneOffset() * 60000;

  return new Date(value.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
}

function ManageEventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);

  // Fetch user's events
  const fetchMyEvents = async () => {
    try {
      setLoading(true);

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

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const updateField = (
    field: keyof EventForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Start editing
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

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // Update event
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
      new URL(form.thumbnail);
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

  // Delete event
  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) return;

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
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Manage My Events
              </h1>

              <p className="mt-3 text-muted-foreground">
                Create, update and manage your community events.
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
          </div>

          <div className="mt-7 inline-flex rounded-full border bg-card px-5 py-2 text-sm">
            <span className="font-bold text-primary">
              {events.length}
            </span>

            <span className="ml-2 text-muted-foreground">
              Events Created
            </span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">

        {/* Edit Form */}
        {editingId && (
          <div className="mb-10 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  Edit Event
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update your event information.
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleCancelEdit}
                aria-label="Cancel editing"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">

                <div className="space-y-2">
                  <Label htmlFor="edit-title">
                    Event Title
                  </Label>

                  <Input
                    id="edit-title"
                    value={form.title}
                    onChange={(e) =>
                      updateField("title", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type">
                    Event Type
                  </Label>

                  <select
                    id="edit-type"
                    value={form.eventType}
                    onChange={(e) =>
                      updateField("eventType", e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-location">
                    Location
                  </Label>

                  <Input
                    id="edit-location"
                    value={form.location}
                    onChange={(e) =>
                      updateField("location", e.target.value)
                    }
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
                    required
                  />
                </div>

              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={saving}>
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
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Events Header */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              Your Created Events
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Only events created by your account are shown here.
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
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

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />

              <p className="text-sm text-muted-foreground">
                Loading your events...
              </p>
            </div>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border bg-card px-5 py-16 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-primary" />

            <h3 className="mt-5 text-xl font-bold">
              No Events Created Yet
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Start creating meaningful community events.
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Your First Event
            </Link>
          </div>
        ) : (
          /* Event List */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover"
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

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleEdit(event)}
                      disabled={deletingId === event._id}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDelete(event._id)}
                      disabled={deletingId === event._id}
                    >
                      {deletingId === event._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}

                      Delete
                    </Button>
                  </div>

                  <Link
                    href={`/upcoming-events/${event._id}`}
                    className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
                  >
                    View Event
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
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
