
"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Users } from "lucide-react";

export default function JoinedEventsPage() {
  return (
    <ProtectedRoute>
      <section className="container-custom py-16">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold">
            My Joined Events
          </h1>

          <p className="mt-2 text-muted-foreground">
            Keep track of the community events you joined.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-12 text-center shadow-sm">
          <p className="text-muted-foreground">
            Events you join will appear here.
          </p>
        </div>
      </section>
    </ProtectedRoute>
  );
}
