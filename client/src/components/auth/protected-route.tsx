
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Checking your login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
  