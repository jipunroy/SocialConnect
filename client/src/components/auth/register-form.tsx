
"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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

    if (!accepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    if (photo) {
      try {
        new URL(photo);
      } catch {
        toast.error("Please enter a valid profile photo URL.");
        return;
      }
    }

    setLoading(true);

    try {
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

      window.location.href = "/";

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
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          autoComplete="name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Profile Photo URL</Label>
        <Input
          id="photo"
          name="photo"
          type="url"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>

        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            autoComplete="new-password"
            className="pr-12"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label="Toggle password visibility"
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

      <div className="flex items-center gap-2">
        <Checkbox
          id="terms"
          checked={accepted}
          onCheckedChange={(checked) =>
            setAccepted(checked === true)
          }
        />

        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the terms and conditions.
        </Label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="gradient-bg w-full text-white"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {loading ? "Creating Account..." : "Create Account"}
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
