
"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  UserRound,
  Upload,
  RotateCcw,
  CheckCircle2,
  Mail,
  ShieldCheck,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/auth/protected-route";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function ProfileContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [savedImage, setSavedImage] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const [saving, setSaving] = useState(false);

  const user = session?.user;

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSavedName(user.name || "");
      setSavedImage(user.image || "");
      setSelectedFile(null);
      setPreviewError(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [user?.name, user?.image]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setPreviewError(false);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewError(false);
    toast.success("Image selected successfully.");
  };

  const handleReset = () => {
    setName(savedName);
    setSelectedFile(null);
    setPreviewError(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.info("Changes have been reset.");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = savedImage;

      // Upload selected image to Cloudinary
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await fetch(
          `${API_URL}/api/upload`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const contentType =
          uploadResponse.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            "Image upload server returned an unexpected response."
          );
        }

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(
            uploadResult.message || "Image upload failed."
          );
        }

        imageUrl = uploadResult.url;
      }

      // Update Better Auth user profile
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl || null,
      });

      if (error) {
        throw new Error(
          error.message || "Profile update failed."
        );
      }

      setSavedName(name.trim());
      setSavedImage(imageUrl || "");
      setSelectedFile(null);
      setPreviewError(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Profile updated successfully!");

      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const currentImage = preview || savedImage;
  const hasChanges =
    name.trim() !== savedName || selectedFile !== null;

  return (
    <div className="min-h-screen bg-muted/30 py-8 sm:py-12">
      <div className="container-custom mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            ACCOUNT SETTINGS
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage your personal information and profile picture.
            Keep your SocialConnect profile up to date.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.5fr]">
          {/* Profile overview */}
          <div className="h-fit overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="h-24 bg-gradient-to-r from-primary to-blue-500" />

            <div className="px-5 pb-6 text-center sm:px-6">
              <div className="-mt-14 mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted shadow-md">
                {currentImage && !previewError ? (
                  <img
                    src={currentImage}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <UserRound className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              <h2 className="mt-4 break-words text-xl font-bold">
                {name || "Your Name"}
              </h2>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                {user?.email}
              </p>

              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-3 py-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  SocialConnect Member
                </span>
              </div>

              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Your profile helps other community members recognize
                and connect with you.
              </p>
            </div>
          </div>

          {/* Profile form */}
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-5 py-4 sm:px-7">
              <h2 className="font-semibold">Personal Information</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your account details below.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-5 sm:p-7"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <span className="text-xs text-muted-foreground">
                    {name.length}/80
                  </span>
                </div>

                <Input
                  id="name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  maxLength={80}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted/50 pl-10"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed from this page.
                </p>
              </div>

              {/* Image upload */}
              <div className="space-y-3">
                <Label>Profile Picture</Label>

                <div className="rounded-xl border border-dashed bg-muted/20 p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Camera className="h-6 w-6" />
                    </div>

                    <p className="font-semibold">
                      Upload your profile picture
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG or WEBP · Maximum 5 MB
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={saving}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      disabled={saving}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="mt-4"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>

                    {selectedFile && (
                      <div className="mt-4 flex max-w-full items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                        <ImagePlus className="h-4 w-4 shrink-0" />
                        <span className="max-w-[220px] truncate">
                          {selectedFile.name}
                        </span>
                      </div>
                    )}

                    {preview && !previewError && (
                      <p className="mt-3 text-xs font-medium text-primary">
                        Image preview ready
                      </p>
                    )}

                    {previewError && (
                      <p className="mt-3 text-xs text-destructive">
                        Unable to preview this image.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving || !hasChanges}
                  onClick={handleReset}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>

                <Button
                  type="submit"
                  disabled={saving || !name.trim() || !hasChanges}
                  className="w-full sm:ml-auto sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
