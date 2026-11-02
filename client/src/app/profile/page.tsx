
"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { UserRound, Mail } from "lucide-react";

function ProfileContent() {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <section className="container-custom py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="mt-2 text-muted-foreground">
            Your SocialConnect account information.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="mb-8 flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || "User"}
              />

              <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-xl font-bold">
              {user?.name || "User"}
            </h2>

            <p className="text-sm text-muted-foreground">
              SocialConnect Member
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
              <UserRound className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Full Name
                </p>

                <p className="font-medium">
                  {user?.name || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
              <Mail className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Email Address
                </p>

                <p className="font-medium">
                  {user?.email || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
