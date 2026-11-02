import { ProtectedRoute } from "@/components/auth/protected-route";

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <div className="container-custom py-10">
        <h1 className="text-3xl font-bold">
          Create Event
        </h1>

        {/* তোমার Create Event form এখানে থাকবে */}
      </div>
    </ProtectedRoute>
  );
} 