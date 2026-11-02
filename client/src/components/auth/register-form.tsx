
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  User,
  Mail,
  Camera,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const form = new FormData(e.currentTarget);

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const photo = String(form.get("photo") || "").trim();
    const password = String(form.get("password") || "");

    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password needs at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password needs at least one lowercase letter.");
      return;
    }

    if (photo) {
      try {
        const parsedUrl = new URL(photo);

        if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
          toast.error("Please enter a valid profile photo URL.");
          return;
        }
      } catch {
        toast.error("Please enter a valid profile photo URL.");
        return;
      }
    }

    if (!accepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photo || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            autoComplete="name"
            className="h-11 pl-10"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11 pl-10"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Profile Photo URL (Optional)</Label>
        <div className="relative">
          <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="photo"
            name="photo"
            type="url"
            placeholder="https://example.com/photo.jpg"
            className="h-11 pl-10"
            disabled={loading}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          You can also upload a profile picture later from your profile.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            autoComplete="new-password"
            className="h-11 pl-10 pr-12"
            required
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Minimum 6 characters, including uppercase and lowercase letters.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-3">
        <Checkbox
          id="terms"
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked === true)}
          disabled={loading}
        />

        <Label
          htmlFor="terms"
          className="cursor-pointer text-sm font-normal leading-5"
        >
          I agree to the terms and conditions.
        </Label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="gradient-bg h-12 w-full text-white shadow-md transition-opacity hover:opacity-90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Your Account
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
