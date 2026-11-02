
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  ImagePlus,
  ArrowLeft,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Community",
  "Other",
];

function getLocalDateTime() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function CreateEventForm() {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "",
    thumbnail: "",
    location: "",
    eventDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.eventType) {
      newErrors.eventType = "Please select an event type.";
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = "Thumbnail image URL is required.";
    } else {
      try {
        const url = new URL(formData.thumbnail);
        if (!["http:", "https:"].includes(url.protocol)) {
          newErrors.thumbnail = "Enter a valid image URL.";
        }
      } catch {
        newErrors.thumbnail = "Enter a valid image URL.";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Event location is required.";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required.";
    } else if (
      new Date(formData.eventDate).getTime() <= Date.now()
    ) {
      newErrors.eventDate = "Please select a future date and time.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please check the form fields.");
      return;
    }

    if (!session?.user) {
      toast.error("Please login before creating an event.");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          eventDate: new Date(formData.eventDate).toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create event.");
      }

      toast.success("Your event was created successfully!");

      setFormData({
        title: "",
        description: "",
        eventType: "",
        thumbnail: "",
        location: "",
        eventDate: "",
      });

      router.push("/upcoming-events");
      router.refresh();
    } catch (error) {
      console.error("Create event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PlusCircle className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create an Event
          </h1>

          <p className="mt-2 text-muted-foreground">
            Bring people together and make a positive impact in your community.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Community Clean-up Day"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Event Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event, its purpose and activities..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                maxLength={2000}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select an event type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="text-sm text-destructive">
                  {errors.eventType}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image URL *</Label>
              <div className="relative">
                <ImagePlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  placeholder="https://example.com/event-image.jpg"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
              {errors.thumbnail && (
                <p className="text-sm text-destructive">
                  {errors.thumbnail}
                </p>
              )}

              {formData.thumbnail && !errors.thumbnail && (
                <div className="mt-3 overflow-hidden rounded-xl border">
                  <img
                    src={formData.thumbnail}
                    alt="Event preview"
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Event Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Dhanmondi, Dhaka"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date & Time *</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="datetime-local"
                  min={getLocalDateTime()}
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
              {errors.eventDate && (
                <p className="text-sm text-destructive">
                  {errors.eventDate}
                </p>
              )}
            </div>

            {/* Creator */}
            <div className="rounded-xl bg-muted/60 p-4">
              <p className="text-sm font-medium">Event Organizer</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {session?.user?.name || "Logged-in user"}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email || ""}
              </p>
            </div>

            {/* Submit */}
            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="min-w-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <CreateEventForm />
    </ProtectedRoute>
  );
}
