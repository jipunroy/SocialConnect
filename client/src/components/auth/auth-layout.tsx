
import Link from "next/link";
import {
  Users,
  Heart,
  Sparkles,
  CalendarDays,
  HandHeart,
  ArrowRight,
} from "lucide-react";

export function AuthLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="container-custom grid min-h-[85vh] items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div className="hidden space-y-10 lg:block">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="gradient-bg flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg">
            <Heart className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Social<span className="gradient-text">Connect</span>
          </span>
        </Link>

        <div className="max-w-lg space-y-6">
          <div className="gradient-bg inline-flex rounded-2xl p-3 text-white shadow-lg">
            <Sparkles className="h-7 w-7" />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
              Connect People.
              <span className="gradient-text block">
                Create Impact.
              </span>
            </h1>

            <p className="text-lg leading-8 text-muted-foreground">
              Join a community of people who care about making
              their neighborhoods better through meaningful
              events and social activities.
            </p>
          </div>
        </div>

        <div className="grid max-w-lg gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/40">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Discover Events</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Find meaningful activities in your community.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/40">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HandHeart className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Make an Impact</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Work together and create positive change.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border bg-muted/30 p-5">
          <div className="gradient-bg rounded-xl p-3 text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">
              Together, We Make a Difference
            </p>
            <p className="text-sm text-muted-foreground">
              Discover events. Meet people. Create change.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="gradient-bg flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <Heart className="h-5 w-5" />
            </span>
            <span className="text-2xl font-bold">
              Social<span className="gradient-text">Connect</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Connect People. Create Impact.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border bg-card shadow-xl shadow-primary/5">
          <div className="h-1.5 gradient-bg" />

          <div className="p-6 sm:p-9">
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {title}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>

            {children}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
  © 2026 SocialConnect. All rights reserved.
</p>
      </div>
    </div>
  );
}
