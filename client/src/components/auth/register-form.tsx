"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (photoURL.trim()) {
      try {
        const url = new URL(photoURL);

        if (!["http:", "https:"].includes(url.protocol)) {
          toast.error("Please enter a valid photo URL.");
          return false;
        }
      } catch {
        toast.error("Please enter a valid photo URL.");
        return false;
      }
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error(
        "Password must contain at least one uppercase letter."
      );
      return false;
    }

    if (!/[a-z]/.test(password)) {
      toast.error(
        "Password must contain at least one lowercase letter."
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions.");
      return false;
    }

    return true;
  };

  // Email registration
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoURL.trim() || undefined,
        callbackURL: `${window.location.origin}/login`,
      });

      if (error) {
        toast.error(
          error.message || "Registration failed. Please try again."
        );
        return;
      }

      toast.success(
        "Account created successfully! Please login."
      );

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google registration
  const handleGoogleRegister = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/register`,
        newUserCallbackURL: `${window.location.origin}/`,
      });

      if (error) {
        toast.error(
          error.message || "Google registration failed."
        );
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google registration error:", error);
      toast.error("Unable to continue with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>

          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 pl-10"
              autoComplete="name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-10"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Profile Photo URL */}
        <div className="space-y-2">
          <Label htmlFor="photoURL">
            Profile Photo URL
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              (Optional)
            </span>
          </Label>

          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="photoURL"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pl-10 pr-11"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Minimum 6 characters with uppercase and lowercase letters.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password
          </Label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 pl-10 pr-11"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            id="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
          />

          <Label
            htmlFor="terms"
            className="cursor-pointer text-sm leading-5 text-muted-foreground"
          >
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium text-primary hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </Label>
        </div>

        {/* Register Button */}
        <Button
          type="submit"
          className="h-11 w-full gradient-bg font-semibold text-white hover:opacity-90"
          disabled={loading || googleLoading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Registration */}
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        onClick={handleGoogleRegister}
        disabled={loading || googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border text-sm font-bold">
            G
          </span>
        )}

        Continue with Google
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}