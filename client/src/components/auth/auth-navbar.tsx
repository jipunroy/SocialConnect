"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Navbar } from "@/components/shared/navbar";

export function AuthNavbar() {
  const router = useRouter();

  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();

  useEffect(() => {
    if (error) {
      console.error("Session error:", error);
    }
  }, [error]);

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }

      toast.success("Logged out successfully!");

      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Something went wrong during logout.");
    }
  };

  if (isPending) {
    return (
      <div className="sticky top-0 z-50 h-16 border-b bg-background" />
    );
  }

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || undefined,
      }
    : null;

  return (
    <Navbar
      user={user}
      onLogout={handleLogout}
    />
  );
}