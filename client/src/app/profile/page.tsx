
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  UserRound,
  Upload,
  RotateCcw,
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

  const [saving, setSaving] = useState(false);

  const user = session?.user;

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSavedName(user.name || "");
      setSavedImage(user.image || "");
      setPreview("");
      setSelectedFile(null);
    }
  }, [user?.name, user?.image]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleReset = () => {
    setName(savedName);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.info("Changes have been reset.");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
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
        toast.error(error.message || "Profile update failed.");
        return;
      }

      setSavedName(name.trim());
      setSavedImage(imageUrl || "");
      setSelectedFile(null);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentImage = preview || savedImage;

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-primary">
            ACCOUNT SETTINGS
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your personal information and profile picture.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          {/* PROFILE PREVIEW */}

          <div className="mb-8 flex flex-col items-center gap-4 border-b pb-8 sm:flex-row">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-primary/15 bg-muted">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <UserRound className="h-12 w-12 text-muted-foreground" />
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">
                {name || user?.name || "Your Name"}
              </h2>

              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {selectedFile
                  ? "New image selected"
                  : "Current profile picture"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>

              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
                maxLength={80}
              />
            </div>

            {/* EMAIL */}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
              />

              <p className="text-xs text-muted-foreground">
                Email address cannot be changed from this page.
              </p>
            </div>

            {/* PROFILE IMAGE UPLOAD */}

            <div className="space-y-3">
              <Label>Profile Picture</Label>

              <div className="rounded-xl border border-dashed p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Camera className="h-6 w-6 text-primary" />
                </div>

                <p className="mb-1 font-medium">
                  Upload your profile picture
                </p>

                <p className="mb-4 text-xs text-muted-foreground">
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
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>

                {selectedFile && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="submit"
                disabled={saving || !name.trim()}
                className="w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </form>
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
