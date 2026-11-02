
"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Settings } from "lucide-react";

export default function ManageEventsPage() {
  return (
    <ProtectedRoute>
      <section className="container-custom py-16">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Settings className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold">
            Manage My Events
          </h1>

          <p className="mt-2 text-muted-foreground">
            View, update and manage the events you created.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-12 text-center shadow-sm">
          <p className="text-muted-foreground">
            Your created events will appear here.
          </p>
        </div>
      </section>
    </ProtectedRoute>
  );
}
