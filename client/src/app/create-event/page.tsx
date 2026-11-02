
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  ImagePlus,
  ArrowLeft,
  Loader2,
  PlusCircle,
  CheckCircle2,
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
  const [imageError, setImageError] = useState(false);

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
    e: ChangeEvent<
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

    if (name === "thumbnail") {
      setImageError(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required.";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "Description must be at least 10 characters.";
    }

    if (!formData.eventType) {
      newErrors.eventType = "Please select an event type.";
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = "Thumbnail image URL is required.";
    } else {
      try {
        const url = new URL(formData.thumbnail.trim());

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
      newErrors.eventDate =
        "Please select a future date and time.";
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
          title: formData.title.trim(),
          description: formData.description.trim(),
          thumbnail: formData.thumbnail.trim(),
          location: formData.location.trim(),
          eventDate: new Date(formData.eventDate).toISOString(),
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          "Server returned an unexpected response. Please try again."
        );
      }

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

      setImageError(false);

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
    <div className="min-h-screen bg-muted/30 py-8 sm:py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PlusCircle className="h-7 w-7" />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Make an Impact
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create an Event
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Bring people together, share your ideas and create
            meaningful change in your community.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-5 py-4 sm:px-8">
            <h2 className="font-semibold">Event Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details below to publish your event.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-5 sm:p-8"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="title">Event Title *</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.title.length}/100
                </span>
              </div>

              <Input
                id="title"
                name="title"
                placeholder="e.g. Community Clean-up Day"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                aria-invalid={!!errors.title}
                className={errors.title ? "border-destructive" : ""}
              />

              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="description">
                  Event Description *
                </Label>
                <span className="text-xs text-muted-foreground">
                  {formData.description.length}/2000
                </span>
              </div>

              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event, its purpose and activities..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                maxLength={2000}
                aria-invalid={!!errors.description}
                className={
                  errors.description ? "border-destructive" : ""
                }
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>

              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                aria-invalid={!!errors.eventType}
                className={`flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring ${
                  errors.eventType
                    ? "border-destructive"
                    : "border-input"
                }`}
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

            <div className="space-y-2">
              <Label htmlFor="thumbnail">
                Thumbnail Image URL *
              </Label>

              <div className="relative">
                <ImagePlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  placeholder="https://example.com/event-image.jpg"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className={`pl-10 ${
                    errors.thumbnail ? "border-destructive" : ""
                  }`}
                  aria-invalid={!!errors.thumbnail}
                />
              </div>

              {errors.thumbnail && (
                <p className="text-sm text-destructive">
                  {errors.thumbnail}
                </p>
              )}

              {formData.thumbnail && !errors.thumbnail && (
                <div className="mt-4 overflow-hidden rounded-xl border bg-muted">
                  {!imageError ? (
                    <img
                      src={formData.thumbnail}
                      alt="Event thumbnail preview"
                      className="h-48 w-full object-cover sm:h-64"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImagePlus className="h-8 w-8" />
                      <p className="text-sm">
                        Unable to load image. Check the URL.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Use a publicly accessible image URL.
              </p>
            </div>

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
                  className={`pl-10 ${
                    errors.location ? "border-destructive" : ""
                  }`}
                  aria-invalid={!!errors.location}
                />
              </div>

              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">
                Event Date & Time *
              </Label>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  id="eventDate"
                  name="eventDate"
                  type="datetime-local"
                  min={getLocalDateTime()}
                  value={formData.eventDate}
                  onChange={handleChange}
                  className={`pl-10 ${
                    errors.eventDate ? "border-destructive" : ""
                  }`}
                  aria-invalid={!!errors.eventDate}
                />
              </div>

              {errors.eventDate && (
                <p className="text-sm text-destructive">
                  {errors.eventDate}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Choose a future date and time for your event.
              </p>
            </div>

            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    Event Organizer
                  </p>

                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {session?.user?.name || "Logged-in user"}
                  </p>

                  <p className="break-all text-xs text-muted-foreground">
                    {session?.user?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => router.push("/")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:min-w-40 sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          By creating an event, you agree to help build a better
          community.
        </p>
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
